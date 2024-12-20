import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import { jwtVerify } from 'jose';
import { decrypt } from '@/lib/crypto';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    if (!Array.isArray(body.participants)) {
      return new Response(JSON.stringify({ error: 'Invalid input data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      decoded = await jwtVerify(token, secret);
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const userId = decoded.payload.userId;
    const client = await clientPromise;
    const db = client.db('main');
    const gameCollection = db.collection('game');
    const game = await gameCollection.findOne({ _id: new ObjectId(id) });

    if (!game) {
      return new Response(JSON.stringify({ error: 'Game not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (game.gamemaster.toString() !== userId) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const participantObjectIds = body.participants.map(id => new ObjectId(id));
    await gameCollection.updateOne(
      { _id: new ObjectId(id) },
      { $pull: { participants: { $in: participantObjectIds } } }
    );

    return new Response(JSON.stringify({ message: 'Participants removed successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error removing participants' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const client = await clientPromise;
    const db = client.db('main');
    const gameCollection = db.collection('game');

    const game = await gameCollection.findOne({ _id: new ObjectId(id) });
    if (!game) {
      return new Response(JSON.stringify({ error: 'Game not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { gamemaster } = game;

    const userCollection = db.collection('userdata');

    const users = await userCollection.find({ _id: { $in: game.participants.map(id => new ObjectId(id)) } }).toArray();
    if (!users || users.length == 0) {
      return new Response(JSON.stringify({ error: 'No users found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    for (let user of users) {
      user.profilePicture = user.profilePicture.startsWith('http') ? user.profilePicture : decrypt(Buffer.from(user.profilePicture, 'base64'));
    }

    return new Response(JSON.stringify({ users, gamemaster }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching contest:', error.message);
    return new Response(JSON.stringify({ error: 'Error fetching contest' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}