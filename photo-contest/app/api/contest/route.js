import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import nodemailer from 'nodemailer';

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

export async function getRandomTheme(categories, history, db) {
    const categoryCollection = db.collection('category');
    const contestCollection = db.collection('contest');

    // Fetch the last contests from history
    const lastContests = await contestCollection.find({ _id: { $in: history.slice(-6).map(id => new ObjectId(id)) } }).toArray();
    const lastCategories = lastContests.map(contest => contest.categoryId);

    // Determine the number of categories to exclude based on the available categories
    const numCategoriesToExclude = Math.min(6, categories.length - 1);
    let availableCategories = categories.filter(category => !lastCategories.slice(-numCategoriesToExclude).includes(category));

    // If all categories are filtered out, reset available categories
    if (availableCategories.length === 0) {
        availableCategories = categories;
    }

    // Select a random category from available categories
    const categoryId = getRandomElement(availableCategories);
    const category = await categoryCollection.findOne({ _id: new ObjectId(categoryId) });

    if (!category || !category.themes || category.themes.length === 0) {
        throw new Error('Invalid category or no themes available in the category');
    }

    // Select a random theme from the category
    const themeId = getRandomElement(category.themes.map(t => t));
    const theme = await db.collection('theme').findOne({ _id: new ObjectId(themeId) });

    if (!theme) {
        throw new Error('Theme not found');
    }

    return { theme, categoryId };
}

export async function contactParticipants(userIds, { title, content }) {
    try {
        const client = await clientPromise;
        const db = client.db('main');
        const userCollection = db.collection('userdata');

        const users = await userCollection.find({ _id: { $in: userIds.map(id => new ObjectId(id)) } }).toArray();

        if (users.length === 0) {
            throw new Error('No participants or gamemaster found');
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        const mailOptions = (mail, username) => ({
            from: process.env.EMAIL_USER,
            to: mail,
            subject: title,
            html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #4CAF50;">News on a contest!</h2>
                <p>Hi ${username},</p>
                <p>${content}</p>
                <p>Best regards,<br/>
                <strong>The Photo Contest Team</strong></p>
                </div>
            </div>
            `,
        });

        for (const user of users) {
            await transporter.sendMail(mailOptions(user.mail, user.name));
        }

        return { message: 'Emails sent successfully' };
    } catch (error) {
        console.error('Error sending emails:', error.message);
        throw new Error('Error sending emails');
    }
}

export async function POST(request) {
    try {
        const body = await request.json();

        if (!Array.isArray(body.categories) || !Array.isArray(body.history) || !Array.isArray(body.participants) || body.title == undefined) {
            return new Response(JSON.stringify({ error: 'Invalid input data' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const client = await clientPromise;
        const db = client.db('main');

        const { theme, categoryId } = await getRandomTheme(body.categories, body.history, db);

        const newContest = {
            _id: new ObjectId(),
            theme: theme._id,
            category: new ObjectId(categoryId),
            photos: [],
            date: new Date().getTime(),
            state: 'UPLOADING',
        };

        const contestCollection = db.collection('contest');
        await contestCollection.insertOne(newContest);

        contactParticipants(body.participants, { title: `${body.title}: A new Contest started !`, content: `Hey !\nA new contest just started, join ${body.title} right now to see today's theme !` }).then(
            response => console.log(response.message)
        ).catch(
            err => console.error(err)
        );

        return new Response(JSON.stringify({ message: 'Contest created successfully', newContest }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error creating contest:', error.message);

        return new Response(JSON.stringify({ error: 'Error creating contest' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}