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
    const db = client.db('main');
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

    const mailOptions = (username) => ({
      from: process.env.EMAIL_USER,
      to: mail,
      subject: 'Password Reset Code',
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #4CAF50;">Here your password reset code!</h2>
          <p>Hi ${username},</p>
          <p>Your password reset code is: <strong>${resetCode}</strong></p>
          <p>Best regards,<br/>
          <strong>The Photo Contest Team</strong></p>
          </div>
      </div>
      `,
    });

    await transporter.sendMail(mailOptions(user.name));

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