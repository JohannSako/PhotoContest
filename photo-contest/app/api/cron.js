import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { contactParticipants } from './contest/route';
import { getRandomTheme } from './contest/route';

async function updateContestState() {
  const client = await clientPromise;
  const db = client.db('main');
  const gameCollection = db.collection('game');
  const contestCollection = db.collection('contest');

  const now = Date.now();

  const games = await gameCollection.find().toArray();

  for (const game of games) {
    const contest = await contestCollection.findOne({ _id: new ObjectId(game.contest) });

    if (!contest) continue;

    if (contest.state === 'UPLOADING' && now >= game.endUpload) {
      // Transition to VOTING
      await contestCollection.updateOne(
        { _id: contest._id },
        { $set: { state: 'VOTING' } }
      );
      // Notify participants and gamemaster
      await contactParticipants(game.participants.concat(game.gamemaster), {
        title: 'Contest Voting Started',
        content: 'The contest voting period has started. Please vote for your favorite photos.'
      });
    } else if (contest.state === 'VOTING' && (now >= game.endVote || (game.whenPlayersVoted && await allParticipantsVoted(game)))) {
      // Transition to BREAK
      await contestCollection.updateOne(
        { _id: contest._id },
        { $set: { state: 'BREAK' } }
      );
      // Notify participants and gamemaster
      await contactParticipants(game.participants.concat(game.gamemaster), {
        title: 'Contest Voting Ended',
        content: 'The contest voting period has ended. Please check the results.'
      });

      // Create new contest and update game history
      const newContestId = await createNewContest(game, db);
      await gameCollection.updateOne(
        { _id: game._id },
        { $set: { contest: newContestId }, $push: { history: contest._id } }
      );
    } else if (contest.state === 'BREAK' && now >= game.startUpload) {
      // Stay in BREAK and create a new contest
      const newContestId = await createNewContest(game, db);
      await gameCollection.updateOne(
        { _id: game._id },
        { $set: { contest: newContestId }, $push: { history: contest._id } }
      );
      // Notify participants and gamemaster
      await contactParticipants(game.participants.concat(game.gamemaster), {
        title: 'New Contest Started',
        content: 'A new contest has started. Please upload your photos.'
      });
    }
  }
}

async function allParticipantsVoted(game) {
  const client = await clientPromise;
  const db = client.db('main');
  const contestCollection = db.collection('contest');

  const contest = await contestCollection.findOne({ _id: new ObjectId(game.contest) });
  const photoCollection = db.collection('photo');
  const photos = await photoCollection.find({ contest_id: contest._id }).toArray();

  const votedUserIds = photos.reduce((voters, photo) => {
    photo.votes.forEach(vote => voters.add(vote.toString()));
    return voters;
  }, new Set());

  return game.participants.every(participant => votedUserIds.has(participant.toString()));
}

async function createNewContest(game, db) {
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
  const userIds = game.participants.concat(game.gamemaster);

  await contactParticipants(userIds, {
    title: `A new Contest started in ${game.title} !`,
    content: `Hey !\nA new contest just started, join ${game.title} right now to see today's theme !`
  });

  return result.insertedId;
}

export default async function handler(req, res) {
  try {
    await updateContestState();
    res.status(200).json({ message: 'Cron job executed successfully' });
  } catch (error) {
    console.error('Error executing cron job:', error.message);
    res.status(500).json({ error: 'Error executing cron job' });
  }
}