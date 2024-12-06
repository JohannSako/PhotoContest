import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcrypt';

function isResetPasswordRequestBody(body) {
  return (
    typeof body.mail === 'string' &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.mail) &&
    typeof body.password === 'string' &&
    body.password.length >= 6
  );
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { mail, password } = body;

    if (!isResetPasswordRequestBody(body)) {
      return new Response(JSON.stringify({ error: 'Invalid input data' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const client = await clientPromise;
    const db = client.db('main');
    const userCollection = db.collection('userdata');

    const hashedPassword = await bcrypt.hash(password, 10);

    await userCollection.updateOne(
      { mail },
      { $set: { password: hashedPassword } }
    );

    return new Response(JSON.stringify({ message: 'Password reset successful' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error resetting password:', error.message);

    return new Response(JSON.stringify({ error: 'Error resetting password' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}