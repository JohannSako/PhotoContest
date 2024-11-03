import clientPromise from '@/lib/mongodb';

function isDeleteUserRequestBody(body) {
  return (
    typeof body.mail === 'string' &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.mail)
  );
}

export async function DELETE(request) {
  try {
    const body = await request.json();
    const { mail } = body;

    if (!isDeleteUserRequestBody(body)) {
      return new Response(JSON.stringify({ error: 'Invalid input data' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const client = await clientPromise;
    const db = client.db('admin');
    const userCollection = db.collection('userdata');

    const result = await userCollection.deleteOne({ mail });

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify({ message: 'User deleted successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error deleting user:', error.message);

    return new Response(JSON.stringify({ error: 'Error deleting user' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
