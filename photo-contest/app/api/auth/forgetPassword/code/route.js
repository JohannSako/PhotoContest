import clientPromise from '@/lib/mongodb';

function isCheckResetCodeRequestBody(body) {
  return (
    typeof body.mail === 'string' &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.mail) &&
    typeof body.code === 'string' &&
    body.code.length === 6
  );
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { mail, code } = body;

    if (!isCheckResetCodeRequestBody(body)) {
      return new Response(JSON.stringify({ error: 'Invalid input data' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const client = await clientPromise;
    const db = client.db('admin');
    const codeCollection = db.collection('code');

    const resetCodeEntry = await codeCollection.findOne({ mail, code });

    if (!resetCodeEntry) {
      return new Response(JSON.stringify({ error: 'Invalid or expired reset code' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    if (new Date() > resetCodeEntry.expiresAt) {
      return new Response(JSON.stringify({ error: 'Reset code expired' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    await codeCollection.deleteOne({ mail, code });

    return new Response(JSON.stringify({ message: 'Reset code is valid' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error checking reset code:', error.message);

    return new Response(JSON.stringify({ error: 'Error checking reset code' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}