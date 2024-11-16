import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import nodemailer from 'nodemailer';

function isRegisterRequestBody(body) {
  return (
    typeof body.name === 'string' &&
    body.name.length >= 4 &&
    typeof body.password === 'string' &&
    body.password.length >= 6 &&
    typeof body.mail === 'string' &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.mail) &&
    typeof body.profilePicture === 'string'
  );
}

export async function POST(request) {
  try {
    const body = await request.json();
    const bcrypt = require('bcrypt');

    console.log(body);
    if (!isRegisterRequestBody(body)) {
      return new Response(JSON.stringify({ error: 'Invalid input data' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const { name, password, mail, profilePicture } = body;

    const client = await clientPromise;
    const db = client.db('main');
    const userCollection = db.collection('userdata');

    // Check if the username or email already exists
    const existingUser = await userCollection.findOne({ $or: [{ name }, { mail }] });
    if (existingUser) {
      return new Response(JSON.stringify({ error: 'Username or email already exists' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      _id: new ObjectId(),
      name,
      password: hashedPassword,
      mail,
      profilePicture,
    };

    await userCollection.insertOne(newUser);

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

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: mail,
      subject: 'Welcome to Photo Contest!',
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #4CAF50;">Welcome to Photo Contest!</h2>
          <p>Hi ${name},</p>
          <p>Welcome to <strong>Photo Contest</strong>! We are thrilled to have you on board.</p>
          <p>Get ready to participate in exciting photo contests and showcase your talent to the world. We hope you enjoy the experience and make the most out of it.</p>
          <p>If you have any questions or need any assistance, feel free to reach out to our support team.</p>
          <p>Best regards,<br/>
          <strong>The Photo Contest Team</strong></p>
        </div>
      </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ message: 'User registered successfully' }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error registering user:', error.message);

    return new Response(JSON.stringify({ error: 'Error registering user' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
