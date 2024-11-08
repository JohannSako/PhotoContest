import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getRandomTheme, contactParticipants } from '../contest/route';
import { user } from '@nextui-org/react';
import { jwtVerify } from 'jose';

function isGameRequestBody(body) {
  return (
    typeof body.title === 'string' &&
    Array.isArray(body.categories)
  );
}

function generateCode() {
  return Math.floor(10000 + Math.random() * 90000);
}

async function createContest(game, db) {
  const categories = game.categories;
  const history = game.history;

  const { theme, categoryId } = await getRandomTheme(categories, history, db);

  const newContest = {
    _id: new ObjectId(),
    theme: theme._id,
    category: new ObjectId(categoryId),
    photos: [],
    date: new Date(new Date().toISOString().split('T')[0]).getTime(),
    state: 'UPLOADING',
  };

  const contestCollection = db.collection('contest');
  const result = await contestCollection.insertOne(newContest);
  const userIds = game.participants;

  userIds.push(game.gamemaster)

  contactParticipants(userIds, { title: `A new Contest started in ${game.title} !`, content: `Hey !\nA new contest just started, join ${game.title} right now to see today's theme !` }).then(
    response => console.log(response.message)
  ).catch(
    err => console.error(err)
  );

  return result.insertedId;
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
    const code = generateCode();

    const newGame = {
      _id: new ObjectId(),
      code,
      participants: [],
      title,
      history: [],
      contest: null,
      startUpload: new Date().setHours(9, 0),
      endUpload: new Date().setHours(16, 0),
      endVote: new Date().setHours(20, 0),
      whenPlayersVoted: false,
      gamemaster: new ObjectId(userId),
      categories: categories.map(id => new ObjectId(id)),
    };

    const contestId = await createContest(newGame, db);
    newGame.contest = contestId;

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
