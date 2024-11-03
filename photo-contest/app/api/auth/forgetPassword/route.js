// pages/api/auth/forgot-password.js
import clientPromise from '@/lib/mongodb';
import nodemailer from 'nodemailer';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

function isEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function generateResetCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { mail } = body;

    if (!isEmailValid(mail)) {
      return new Response(JSON.stringify({ error: 'Invalid email address' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const client = await clientPromise;
    const db = client.db('admin');
    const userCollection = db.collection('userdata');
    const codeCollection = db.collection('code');

    const user = await userCollection.findOne({ mail });

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const resetCode = generateResetCode();
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 1);

    await codeCollection.insertOne({
      mail,
      code: resetCode,
      expiresAt: expirationDate,
    });

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
      subject: 'Password Reset Code',
      text: `Your password reset code is: ${resetCode}`,
      html: `<p>Your password reset code is: <strong>${resetCode}</strong></p>`,
    };

    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ message: 'Password reset code sent' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error sending password reset email:', error.message);

    return new Response(JSON.stringify({ error: 'Error sending password reset email' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}