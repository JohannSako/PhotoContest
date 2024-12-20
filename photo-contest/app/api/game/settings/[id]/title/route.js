import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import { jwtVerify } from 'jose';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    if (!body.title || typeof body.title !== 'string') {
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

    await gameCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { title: body.title } }
    );

    return new Response(JSON.stringify({ message: 'Title updated successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error updating title' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}