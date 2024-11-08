"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import GameUploading from './steps/uploading';
import GameVoting from './steps/voting';
import GameBreak from './steps/break';

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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const { game, contest, theme, photos } = data;

    switch (contest.state) {
        case 'UPLOADING':
            return <GameVoting contest={contest} gamemaster={game.gamemaster} theme={theme} photos={photos} />
        case 'VOTING':
            return <GameVoting contest={contest} gamemaster={game.gamemaster} theme={theme} photos={photos} />
        case 'BREAK':
            return <GameBreak contest={contest} gamemaster={game.gamemaster} theme={theme} />
        default:
            alert('the state is invalid: ' + contest.state);
            router.back();
    }
}

export default function GameWrapper() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Game />
        </Suspense>
    );
}