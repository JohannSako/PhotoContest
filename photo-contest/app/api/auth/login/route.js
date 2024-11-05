import clientPromise from '@/lib/mongodb';
import jwt from 'jsonwebtoken';

function isLoginRequestBody(body) {
  return (
    typeof body.mail === 'string' &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.mail) &&
    typeof body.password === 'string'
  );
}

export async function POST(request) {
  try {
    const body = await request.json();
    const bcrypt = require('bcrypt');

    if (!isLoginRequestBody(body)) {
      return new Response(JSON.stringify({ error: 'Invalid input data' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const { mail, password } = body;

    const client = await clientPromise;
    const db = client.db('admin');
    const userCollection = db.collection('userdata');

    const user = await userCollection.findOne({ mail });

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    return new Response(JSON.stringify({ message: 'Login successful', token }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error logging in:', error.message);

    return new Response(JSON.stringify({ error: 'Error logging in' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}