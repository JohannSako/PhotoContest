import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { decrypt } from '@/lib/crypto';

export async function GET(request, { params }) {
    try {
        const { id } = params;

        const client = await clientPromise;
        const db = client.db('main');
        const gameCollection = db.collection('game');
        const contestCollection = db.collection('contest');
        const photoCollection = db.collection('photo');

        const game = await gameCollection.findOne({ _id: new ObjectId(id) });
        if (!game) {
            return new Response(JSON.stringify({ error: 'Game not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const allContestIds = [game.contest, ...(game.history || [])].map(cid => new ObjectId(cid));
        const contests = await contestCollection.find({ _id: { $in: allContestIds } }).toArray();

        if (!contests || contests.length === 0) {
            return new Response(JSON.stringify({ error: 'No contests found for this game' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        for (const contest of contests) {
            if (!contest.photos || contest.photos.length === 0) {
                contest.photo = null;
                continue;
            }

            const photos = await photoCollection.find({ _id: { $in: contest.photos.map(p => new ObjectId(p)) } }).toArray();

            if (!photos || photos.length === 0) {
                contest.photo = null;
                continue;
            }

            for (let photo of photos) {
                photo.photo = photo.photo.startsWith('http') ? photo.photo : decrypt(Buffer.from(photo.photo, 'base64'));
            }

            let winnerPhoto = null;
            let maxVotes = -1;

            for (const photo of photos) {
                const votesCount = photo.votes ? photo.votes.length : 0;
                if (votesCount > maxVotes) {
                    maxVotes = votesCount;
                    winnerPhoto = photo;
                }
            }

            contest.photo = winnerPhoto || null;
        }

        return new Response(JSON.stringify({ game, contests }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Error fetching all contests:', error.message);
        return new Response(JSON.stringify({ error: 'Error fetching all contests' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
