import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import { jwtVerify } from 'jose';

async function authenticateToken(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized');
  }

  const token = authHeader.split(' ')[1];
  let decoded;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    decoded = await jwtVerify(token, secret);
  } catch (err) {
    throw new Error('Invalid token');
  }

  return decoded.payload.userId;
}

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const userId = await authenticateToken(request);

    const client = await clientPromise;
    const db = client.db('main');
    const photoCollection = db.collection('photo');
    const contestCollection = db.collection('contest');

    const photo = await photoCollection.findOne({ _id: new ObjectId(id) });

    if (!photo) {
      return new Response(JSON.stringify({ error: 'Photo not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const contest = await contestCollection.findOne({ _id: photo.contest_id });

    if (!contest || contest.state !== 'VOTING') {
      return new Response(JSON.stringify({ error: 'Contest not in voting state' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (photo.votes.includes(userId)) {
      return new Response(JSON.stringify({ error: 'User has already voted for this photo' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await photoCollection.updateOne(
      { _id: new ObjectId(id) },
      { $push: { votes: new ObjectId(userId) } }
    );

    return new Response(JSON.stringify({ message: 'Vote cast successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error casting vote:', error.message);
    return new Response(JSON.stringify({ error: `Error casting vote: ${error.message}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}