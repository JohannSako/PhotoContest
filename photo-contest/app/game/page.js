"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import GameUploading from './steps/uploading';
import GameVoting from './steps/voting';
import GameBreak from './steps/break';
import Loader from '@/components/loader';
import GameTheme from './steps/theme';

function Game() {
    const searchParams = useSearchParams();
    const _id = searchParams.get('_id');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchGameAndContest() {
            try {
                const response = await fetch(`/api/game/${_id}/contest`);
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Failed to fetch data');
                }

                setData(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        if (_id) {
            fetchGameAndContest();
        }
    }, [_id]);

    if (loading) return <Loader />;
    if (error) return <div>Error: {error}</div>;

    const { game, contest, theme, photos, category } = data;

    switch (contest.state) {
        case 'UPLOADING':
            return <GameUploading contest={contest} gamemaster={game.gamemaster} gameId={game._id} theme={theme} category={category} />
        case 'VOTING':
            return <GameVoting gamemaster={game.gamemaster} gameId={game._id} theme={theme} photos={photos} />
        case 'BREAK':
            return <GameBreak gamemaster={game.gamemaster} gameId={game._id} theme={theme} photos={photos} />
        default:
            alert('the state is invalid: ' + contest.state);
            router.back();
    }
}

export default function GameWrapper() {
    return (
        <Suspense fallback={<Loader />}>
            <Game />
        </Suspense>
    );
}