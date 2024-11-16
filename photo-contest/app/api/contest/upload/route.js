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

export async function POST(request) {
  try {
    const userId = await authenticateToken(request);
    const formData = await request.formData();
    const file = formData.get('photo');
    const contestId = formData.get('contestId');

    if (!file || !contestId) {
      return new Response(JSON.stringify({ error: 'Invalid input data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const client = await clientPromise;
    const db = client.db('main');
    const contestCollection = db.collection('contest');
    const photoCollection = db.collection('photo');

    const contest = await contestCollection.findOne({ _id: new ObjectId(contestId) });

    if (!contest || contest.state !== 'UPLOADING') {
      return new Response(JSON.stringify({ error: 'Contest not in uploading state' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const photoUrl = `data:image/jpeg;base64,${Buffer.from(await file.arrayBuffer()).toString('base64')}`;

    await photoCollection.deleteOne({ contest_id: new ObjectId(contestId), user_id: new ObjectId(userId) });

    const newPhoto = {
      _id: new ObjectId(),
      photo: photoUrl,
      date: Date.now(),
      votes: [],
      contest_id: new ObjectId(contestId),
      user_id: new ObjectId(userId),
      theme: new ObjectId(contest.theme),
    };

    await photoCollection.insertOne(newPhoto);

    await contestCollection.updateOne(
      { _id: new ObjectId(contestId) },
      { $push: { photos: newPhoto._id } }
    );

    return new Response(JSON.stringify({ message: 'Photo uploaded successfully', photo: newPhoto }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error uploading photo:', error.message);
    return new Response(JSON.stringify({ error: `Error uploading photo: ${error.message}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}