import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

function isDeleteUserRequestBody(body) {
  return (
    typeof body.id === 'string'
  );
}

export async function DELETE(request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!isDeleteUserRequestBody(body)) {
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

    const result = await userCollection.deleteOne({ _id: new ObjectId(id) });

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
