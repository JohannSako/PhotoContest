import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db('admin');
    const categoryCollection = db.collection  ('category');
    const themeCollection = db.collection('theme');

    const { name } = params;

    const category = await categoryCollection.findOne({ title: name });

    if (!category) {
      return new Response(JSON.stringify({ error: 'Category not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const themeObjectIds = [];
    category.themes.forEach(id => {
      try {
        themeObjectIds.push(new ObjectId(id['$id']));
      } catch (e) {
        console.error('Invalid ObjectId:', id, e);
      }
    });

    if (themeObjectIds.length === 0) {
      return new Response(JSON.stringify({ error: 'No valid theme IDs found' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const themes = await themeCollection.find({ _id: { $in: themeObjectIds } }).toArray();
    console.log('Fetched themes:', themes);

    return new Response(JSON.stringify({ ...category, themes }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching category:', error.message);

    return new Response(JSON.stringify({ error: `Error fetching category: ${error.message}` }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
