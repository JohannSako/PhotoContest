import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import { jwtVerify } from 'jose';

export async function POST(request, { params }) {
    try {
        const { code } = params;

        if (isNaN(Number(code)) || Number(code) < 0 || Number(code) > 99999) {
            return new Response(JSON.stringify({ error: 'Invalid input data' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

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
        let decoded;
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
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

        const client = await clientPromise;
        const db = client.db('admin');
        const gameCollection = db.collection('game');
        const userObjectId = new ObjectId(userId);

        const game = await gameCollection.findOne({ code: Number(code) });

        if (!game) {
            return new Response(JSON.stringify({ error: 'Game not found' }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        if (game.participants.some(participant => participant.equals(userObjectId))) {
            return new Response(JSON.stringify({ error: 'User is already in the game' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        await gameCollection.updateOne(
            { code: Number(code) },
            { $push: { participants: userObjectId } }
        );

        return new Response(JSON.stringify({ message: 'User joined the game successfully' }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error joining game:', error.message);

        return new Response(JSON.stringify({ error: 'Error joining game' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
