// app/api/theme/route.js

import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('admin');
    const collection = db.collection('theme');

    const themes = await collection.find({}).toArray();

    return new Response(JSON.stringify(themes), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error fetching themes' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}