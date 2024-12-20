import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import { jwtVerify } from 'jose';

function normalizeToTime(milliseconds) {
  const date = new Date(milliseconds);
  return date.getHours() * 60 + date.getMinutes();
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    if (!body.startUpload || !body.endUpload || !body.endVote || typeof body.whenPlayersVoted !== 'boolean') {
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

    if (normalizeToTime(body.startUpload) >= normalizeToTime(body.endUpload)) {
      return new Response(JSON.stringify({ error: "Ending upload can't happen before the start" }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    else if (normalizeToTime(body.endUpload) >= normalizeToTime(body.endVote)) {
      return new Response(JSON.stringify({ error: "Ending vote can't happen before the upload's end" }), {
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

    await gameCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { startUpload: body.startUpload, endUpload: body.endUpload, endVote: body.endVote, whenPlayersVoted: body.whenPlayersVoted } }
    );

    return new Response(JSON.stringify({ message: 'Contest time updated successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error updating contest time' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}