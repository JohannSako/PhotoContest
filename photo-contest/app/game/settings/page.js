"use client";

import Header from "@/components/header";
import TextInput from "@/components/input/text";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Loader from "@/components/loader";
import Button from "@/components/input/button";
import Cookies from "js-cookie";

function GameSettings() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [data, setData] = useState(null);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const _id = searchParams.get('_id');

    useEffect(() => {
        async function fetchGame() {
            try {
                const response = await fetch(`/api/game/${_id}`);
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Failed to fetch data');
                }

                setData(result);
                setTitle(result.game.title)
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        if (_id) {
            fetchGame();
        }
    }, [_id]);

    if (loading) return <Loader />;
    if (error) return <div>Error: {error}</div>;

    const { game } = data;

    const handleApply = async () => {
        try {
            const response = await fetch(`/api/game/settings/${_id}/title`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('token')}`,
                },
                body: JSON.stringify({ title: title }),
            });
            const result = await response.json();
            if (response.ok) {
                alert('Title updated successfully');
            } else {
                alert(result.error || 'Failed to update title');
            }
        } catch (err) {
            alert('Error updating title');
            console.error(err);
        }
    }

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    }

    return (
        <div className="flex h-[100vh] items-center flex-col p-4 justify-between">
            <div className="flex items-center flex-col p-4 gap-[21px]">
                <Header
                    title="Game Settings"
                    left="Back"
                    leftFunction={() => router.back()}
                    right="Apply"
                    rightFunction={handleApply}
                />
                <TextInput
                    value={title}
                    onChange={handleTitleChange}
                />
                <div className="flex flex-col gap-4">
                    <Button
                        text="Categories"
                        type="secondary"
                        width="343px"
                        onClick={() => router.push(`/game/settings/categories?_id=${_id}`)}
                    />
                    <Button
                        text="Participants"
                        type="secondary"
                        width="343px"
                        onClick={() => router.push(`/game/settings/participants?_id=${_id}`)}
                    />
                    <Button
                        text="Contest Time"
                        type="secondary"
                        width="343px"
                        onClick={() => router.push(`/game/settings/contestTime?_id=${_id}`)}
                    />
                </div>
            </div>
            <Button
                text="Delete Game"
                type="delete"
                width="343px"
            />
        </div>
    )
}

export default function GameSettingsWrapper() {
    return (
        <Suspense fallback={<Loader />}>
            <GameSettings />
        </Suspense>
    );
}