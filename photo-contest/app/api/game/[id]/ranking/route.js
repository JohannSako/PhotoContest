import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
    try {
        const { id } = params; // ID de la game

        const client = await clientPromise;
        const db = client.db('main');
        const gameCollection = db.collection('game');
        const contestCollection = db.collection('contest');
        const photoCollection = db.collection('photo');
        const userCollection = db.collection('userdata');

        // Récupérer la game
        const game = await gameCollection.findOne({ _id: new ObjectId(id) });
        if (!game) {
            return new Response(JSON.stringify({ error: 'Game not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const contestIds = game.history.map(contestId => new ObjectId(contestId));

        const aggregationPipeline = [
            {
                $match: {
                    _id: { $in: contestIds },
                    state: "BREAK"
                }
            },
            {
                $lookup: {
                    from: 'photo',
                    localField: '_id',
                    foreignField: 'contest_id',
                    as: 'photos'
                }
            },
            { $unwind: '$photos' },
            {
                $addFields: {
                    votesCount: { $size: { $ifNull: ['$photos.votes', []] } }
                }
            },
            {
                $sort: { '_id': 1, 'votesCount': -1 }
            },
            {
                $group: {
                    _id: '$_id',
                    winnerUserId: { $first: '$photos.user_id' }
                }
            },
            // Group par user_id pour accumuler les scores
            {
                $group: {
                    _id: '$winnerUserId',
                    score: { $sum: 1 }
                }
            }
        ];

        const scoreResults = await contestCollection.aggregate(aggregationPipeline).toArray();

        const userScores = {};
        scoreResults.forEach(result => {
            userScores[result._id.toString()] = result.score;
        });

        const photos = await photoCollection.find({
            contest_id: { $in: contestIds },
        }).toArray();

        const allUserIdsSet = new Set(photos.map(photo => photo.user_id.toString()));
        const allUserIds = Array.from(allUserIdsSet).map(id => new ObjectId(id));

        const users = await userCollection.find({ _id: { $in: allUserIds } }).toArray();

        // Construire la liste des utilisateurs avec leurs scores, incluant ceux avec 0 points
        const usersWithScores = users.map(user => ({
            user,
            score: userScores[user._id.toString()] || 0,
        }));

        // Trier les utilisateurs par score décroissant
        usersWithScores.sort((a, b) => b.score - a.score);

        return new Response(JSON.stringify({ users: usersWithScores }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Error fetching game users:', error.message);
        return new Response(JSON.stringify({ error: 'Error fetching game users' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
