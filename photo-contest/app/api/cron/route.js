import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { contactParticipants } from '../contest/route';
import { getRandomTheme } from '../contest/route';
import { headers, cookies } from 'next/headers';

function normalizeToTime(milliseconds) {
    const date = new Date(milliseconds);
    return date.getHours() * 60 + date.getMinutes();
}

function isNowNextDay(time) {
    const now = new Date();
    const timeToVerify = new Date(time);

    return now.getDay() > timeToVerify.getDay();
}

async function updateContestState() {
    const client = await clientPromise;
    const db = client.db('main');
    const gameCollection = db.collection('game');
    const contestCollection = db.collection('contest');

    const now = normalizeToTime(Date.now());

    const games = await gameCollection.find().toArray();

    for (const game of games) {
        try {
            const contest = await contestCollection.findOne({ _id: new ObjectId(game.contest) });

            if (!contest) continue;

            const endUploadTime = normalizeToTime(game.endUpload);
            const endVoteTime = normalizeToTime(game.endVote);
            const startUploadTime = normalizeToTime(game.startUpload);

            const contestCreationTime = normalizeToTime(contest.date);

            const headersList = headers();
            const defaultLocale = headersList.get("accept-language");
            const locale = cookies().get("NEXT_LOCALE")?.value || defaultLocale || "en";
            const isFrench = locale.includes('fr');

            if (contest.state === 'UPLOADING' && now >= endUploadTime && (contestCreationTime < endUploadTime || isNowNextDay(contest.date))) {
                await contestCollection.updateOne(
                    { _id: contest._id },
                    { $set: { state: 'VOTING' } }
                );

                await contactParticipants(game.participants.concat(game.gamemaster), {
                    title: `${game.title}: ` + (isFrench ?
                        "Vote du concours commencé" :
                        "Contest Voting Started"),
                    content: isFrench ?
                        `La période de vote du concours a commencé. Veuillez voter pour vos photos préférées.` :
                        `The contest voting period has started. Please vote for your favorite photos.`
                }, isFrench ? 'fr' : 'en');
            } else if (contest.state === 'VOTING' && ((game.whenPlayersVoted && await allParticipantsVoted(game)) || (!game.whenPlayersVoted && now >= endVoteTime))) {
                await contestCollection.updateOne(
                    { _id: contest._id },
                    { $set: { state: 'BREAK' } }
                );

                await contactParticipants(game.participants.concat(game.gamemaster), {
                    title: `${game.title}: ` + (isFrench ?
                        "Vote du concours terminé" :
                        "Contest Voting Ended"),
                    content: isFrench ?
                        `La période de vote du concours est terminée. Veuillez vérifier les résultats.` :
                        `The contest voting period has ended. Please check the results.`
                }, isFrench ? 'fr' : 'en');
            } else if (contest.state === 'BREAK' && now >= startUploadTime && now <= endUploadTime) {
                const newContestId = await createNewContest(game, db);
                await gameCollection.updateOne(
                    { _id: game._id },
                    { $set: { contest: newContestId }, $push: { history: contest._id } }
                );
            }
        } catch (err) {
            console.error('Error executing cron job:', err.message);
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

    const headersList = headers();
    const defaultLocale = headersList.get("accept-language");
    const locale = cookies().get("NEXT_LOCALE")?.value || defaultLocale || "en";
    const isFrench = locale.includes('fr');

    const { theme, categoryId } = await getRandomTheme(categories, history, db);

    const newContest = {
        _id: new ObjectId(),
        theme: theme._id,
        category: new ObjectId(categoryId),
        photos: [],
        date: new Date().getTime(),
        state: 'UPLOADING',
    };

    const contestCollection = db.collection('contest');
    const result = await contestCollection.insertOne(newContest);
    const userIds = game.participants.concat(game.gamemaster);

    await contactParticipants(userIds, {
        title: `${game.title}: ` + (isFrench ?
            "Un nouveau concours a commencé !" :
            "A new Contest started !"),
        content: isFrench ?
            `Salut !\nUn nouveau concours vient de commencer, rejoignez ${game.title} dès maintenant pour voir le thème d'aujourd'hui !` :
            `Hey !\nA new contest just started, join ${game.title} right now to see today's theme !`
    }, isFrench ? 'fr' : 'en');

    return result.insertedId;
}

export async function POST(request) {
    try {
        await updateContestState();
        return new Response(JSON.stringify({ message: 'Cron job executed successfully' }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error executing cron job:', error.message);
        return new Response(JSON.stringify({ message: 'Error executing cron job' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
