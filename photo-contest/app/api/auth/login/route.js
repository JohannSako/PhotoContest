import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcrypt';
import { SignJWT } from 'jose';

function isLoginRequestBody(body) {
  return (
    typeof body.mail === 'string' &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.mail) &&
    typeof body.password === 'string' &&
    body.password.length >= 6
  );
}

export async function POST(request) {
  try {
    const body = await request.json();

    console.log("before input data");
    if (!isLoginRequestBody(body)) {
      return new Response(JSON.stringify({ error: 'Invalid input data' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const { mail, password } = body;

    console.log("before promise");
    const client = await clientPromise;
    const db = client.db('admin');
    const userCollection = db.collection('userdata');

    const user = await userCollection.findOne({ mail });

    console.log("before finding user");
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    console.log(user);

    const isValidPassword = await bcrypt.compare(password, user.password);

    console.log("before valid password");
    if (!isValidPassword) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    console.log("token");
    const token = await new SignJWT({ userId: user._id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    console.log("before return");
    return new Response(JSON.stringify({ message: 'Login successful', token }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error logging in:', error);

    return new Response(JSON.stringify({ error: 'Error logging in' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
