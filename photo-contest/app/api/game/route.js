import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

function isGameRequestBody(body) {
    return (
        typeof body.title === 'string' &&
        Array.isArray(body.categories)
    );
}

function generateCode() {
    return Math.floor(10000 + Math.random() * 90000);
}

export async function POST(request) {
    try {
        const body = await request.json();

        if (!isGameRequestBody(body)) {
            return new Response(JSON.stringify({ error: 'Invalid input data' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        const { title, categories } = body;

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
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            console.error('JWT verification error:', err);
            return new Response(JSON.stringify({ error: 'Invalid token' }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        const userId = decoded.userId;

        const client = await clientPromise;
        const db = client.db('admin');
        const gameCollection = db.collection('game');
        const code = generateCode();

        const newGame = {
            _id: new ObjectId(),
            code,
            participants: [],
            title,
            history: [],
            contest: null,
            start: new Date().setHours(9, 0),
            end: new Date().setHours(16, 0),
            whenPlayersVoted: false,
            gamemaster: new ObjectId(userId),
            categories: categories.map(id => new ObjectId(id)),
        };

        const result = await gameCollection.insertOne(newGame);

        return new Response(JSON.stringify({ message: 'Game created successfully', result }), {
            status: 201,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error creating game:', error.message);

        return new Response(JSON.stringify({ error: 'Error creating game' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.userId;

    const client = await clientPromise;
    const db = client.db('admin');
    const gameCollection = db.collection('game');

    const games = await gameCollection.find({
      $or: [
        { gamemaster: new ObjectId(userId) },
        { participants: new ObjectId(userId) }
      ]
    }).toArray();

    return new Response(JSON.stringify(games), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
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
