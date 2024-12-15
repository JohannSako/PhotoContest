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

    const client = await clientPromise;
    const db = client.db('main');
    const photoCollection = db.collection('photo');

    const photo = await photoCollection.findOne({ _id: new ObjectId(id) });

    if (!photo) {
      return new Response('Photo not found', {
        status: 404,
        headers: { 'Content-Type': 'text/plain' },
      });
    }

    const base64Photo = photo.photo.startsWith('http') ? photo.photo : decrypt(Buffer.from(photo.photo, 'base64'));
    
    const binaryPhoto = Buffer.from(base64Photo.split(',')[1], 'base64');

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