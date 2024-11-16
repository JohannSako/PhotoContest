import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

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

        return new Response(JSON.stringify({ game }), {
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