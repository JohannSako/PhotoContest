import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('admin');
    const collection = db.collection('category');

    const categories = await collection.find({}).toArray();

    return new Response(JSON.stringify(categories), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error fetching categories' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}