import clientPromise from '@/lib/mongodb';
import { jwtVerify } from "jose";
import { ObjectId } from 'mongodb';

export async function DELETE(request, { params }) {
    try {
        const { id } = params;
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        const token = authHeader.split(' ')[1];
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        let decoded;
        try {
            decoded = await jwtVerify(token, secret);
        } catch (err) {
            console.error('JWT verification error:', err);
            return new Response(JSON.stringify({ error: 'Invalid token' }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        const userId = decoded.payload.userId;
        const userIdObject = new ObjectId(userId);

        const client = await clientPromise;
        const db = client.db('admin');
        const gameCollection = db.collection('game');

        const game = await gameCollection.findOne({ _id: new ObjectId(id) });

        if (!game) {
            return new Response(JSON.stringify({ error: 'This game does not exist' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (game.gamemaster == userId) {
            await gameCollection.deleteOne({ _id: new ObjectId(id) });
            return new Response(JSON.stringify({ message: 'Game has been successfully deleted' }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } else if (game.participants.some(participant => participant.equals(userIdObject))) {
            await gameCollection.updateOne(
                { _id: new ObjectId(id) },
                { $pull: { participants: userIdObject } }
            );
            return new Response(JSON.stringify({ message: 'User has been removed from the game participants list' }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } else {
            return new Response(JSON.stringify({ error: 'Invalid user' }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
    } catch (error) {
        console.error('Error fetching games:', error.message);

        return new Response(JSON.stringify({ error: 'Error fetching games' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
