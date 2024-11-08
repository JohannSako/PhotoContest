import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return new Response('Invalid photo ID', {
        status: 400,
        headers: { 'Content-Type': 'text/plain' },
      });
    }

    console.log("A");
    const client = await clientPromise;
    console.log("B");
    const db = client.db('admin');
    console.log("C");
    const photoCollection = db.collection('photo');
    console.log("D");

    const photo = await photoCollection.findOne({ _id: new ObjectId(id) });
    console.log("E");

    if (!photo) {
      return new Response('Photo not found', {
        status: 404,
        headers: { 'Content-Type': 'text/plain' },
      });
    }

    console.log("F");
    // Extract the photo data (base64-encoded string)
    const base64Photo = photo.photo;

    console.log("G");
    // Decode the base64 string
    const binaryPhoto = Buffer.from(base64Photo.split(',')[1], 'base64');

    console.log("H");
    return new Response(binaryPhoto, {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Length': binaryPhoto.length,
      },
    });
  } catch (error) {
    console.error('Error fetching photo:', error.message);

    return new Response('Error fetching photo', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}