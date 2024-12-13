import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const { subscription } = await req.json();

    const client = await clientPromise;
    const db = client.db('main');
    const userCollection = db.collection('userdata');

    if (!subscription) {
      await userCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { notificationsEnabled: false, pushSubscription: null } }
      );
      return NextResponse.json({ success: true });
    }

    await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          notificationsEnabled: true,
          pushSubscription: subscription
        }
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving subscription', error);
    return NextResponse.json({ error: 'Error saving subscription' }, { status: 500 });
  }
}