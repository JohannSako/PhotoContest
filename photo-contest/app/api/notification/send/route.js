import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import webpush from 'web-push';
import { ObjectId } from 'mongodb';

webpush.setVapidDetails(
  `mailto:${process.env.EMAIL_USER}`,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export async function POST(req) {
  try {
    const { title, body } = await req.json();

    const client = await clientPromise;
    const db = client.db('main');
    const userCollection = db.collection('userdata');

    const users = await userCollection.find({ notificationsEnabled: true, pushSubscription: { $ne: null } }).toArray();

    const payload = JSON.stringify({ title, body });

    const sendPromises = users.map(user => {
      const sub = user.pushSubscription;
      return webpush.sendNotification(sub, payload).catch(err => {
        console.error('Error sending notification', err);
      });
    });

    await Promise.all(sendPromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending notifications', error);
    return NextResponse.json({ error: 'Error sending notifications' }, { status: 500 });
  }
}