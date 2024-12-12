import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
    try {
        const { id } = params;

        const client = await clientPromise;
        const db = client.db('main');
        const contestCollection = db.collection('contest');
        const themeCollection = db.collection('theme');
        const photoCollection = db.collection('photo');
        const userCollection = db.collection('userdata');

        const contest = await contestCollection.findOne({ _id: new ObjectId(id) });
        if (!contest) {
            return new Response(JSON.stringify({ error: 'Contest not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const theme = await themeCollection.findOne({ _id: new ObjectId(contest.theme) });
        if (!theme) {
            return new Response(JSON.stringify({ error: 'Theme not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const photos = await photoCollection.find({ _id: { $in: contest.photos } }).toArray();
        if (!photos) {
            return new Response(JSON.stringify({ error: 'Photos not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        } else if (photos.length === 0) {
            return new Response(JSON.stringify({ game, contest, theme, photos: [], category }), {
                status: 202,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const userIds = photos.map(photo => photo.user_id);
        const users = await userCollection.find({ _id: { $in: userIds } }).toArray();

        if (!users || users.length === 0) {
            return new Response(JSON.stringify({ error: 'Users from photo not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const photosWithUserDetails = photos.map(photo => {
            const user = users.find(user => user._id.equals(photo.user_id));
            return { ...photo, user };
        });

        return new Response(JSON.stringify({ contest, theme, photos: photosWithUserDetails }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching contest:', error.message);
        return new Response(JSON.stringify({ error: 'Error fetching contest' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}