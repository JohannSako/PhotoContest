"use client";

import Header from "@/components/header";
import TextInput from "@/components/input/text";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Loader from "@/components/loader";
import Button from "@/components/input/button";
import Cookies from "js-cookie";
import PopUp from "@/components/popUp";
import toast from "react-hot-toast";
import { useTranslation } from "@/context/TranslationContext";

function GameSettings() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [title, setTitle] = useState('');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deletePopUp, setDeletePopUp] = useState(false);

    const { dictionary } = useTranslation();

    const _id = searchParams.get('_id');

    useEffect(() => {
        async function fetchGame() {
            try {
                const response = await fetch(`/api/game/${_id}`);
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Failed to fetch data');
                }

                setTitle(result.game.title)
                setCode(result.game.code);
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

    if (error) return <div>Error: {error}</div>;

    const handleApply = async () => {
        try {
            setLoading(true);
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
                toast.success('Title updated successfully');
            } else {
                toast.error(result.error || 'Failed to update title');
            }
        } catch (err) {
            toast.error('Error updating title');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    }

    const deleteGame = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/game/delete/${_id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('token')}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                toast.success('Game has been successfully deleted !');
                router.push('/home');
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error('Error deleting game');
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const showCode = async () => {
        if (!code) {
            toast.error("No code to copy");
            return;
        }

        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(code);
                toast.success(`CODE COPIED: ${code}`);
            } else {
                const textArea = document.createElement("textarea");
                textArea.value = code;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand("copy");
                document.body.removeChild(textArea);
                toast.success(`CODE COPIED: ${code}`);
            }
        } catch (err) {
            toast.error("Failed to copy code");
            console.error("Clipboard write failed:", err);
        }
    };

    return (
        <div className="flex h-[100vh] items-center flex-col p-4 justify-between">
            {loading && <Loader />}
            <div className="flex items-center flex-col p-4 gap-[21px]">
                <Header
                    title={dictionary.gameSettings}
                    left={dictionary.back}
                    leftFunction={() => router.back()}
                    right={dictionary.apply}
                    rightFunction={handleApply}
                />
                <TextInput
                    placeholder={dictionary.enterText}
                    value={title}
                    onChange={handleTitleChange}
                />
                <div className="flex flex-col gap-4">
                    <Button
                        text={dictionary.categories}
                        type="secondary"
                        width="343px"
                        onClick={() => router.push(`/game/settings/categories?_id=${_id}`)}
                    />
                    <Button
                        text={dictionary.participants}
                        type="secondary"
                        width="343px"
                        onClick={() => router.push(`/game/settings/participants?_id=${_id}`)}
                    />
                    <Button
                        text={dictionary.contestTime}
                        type="secondary"
                        width="343px"
                        onClick={() => router.push(`/game/settings/contestTime?_id=${_id}`)}
                    />
                    <Button
                        text={dictionary.code}
                        type="secondary"
                        width="343px"
                        onClick={showCode}
                    />
                </div>
            </div>
            <Button
                text={dictionary.deleteGame}
                type="delete"
                width="343px"
                onClick={() => setDeletePopUp(true)}
            />
            {deletePopUp && <div className="absolute top-1/2 -translate-y-1/2">
                <PopUp
                    title={dictionary.deletingGame}
                    content={dictionary.deletingGameText}
                    firstTextButton={dictionary.delete}
                    firstButton={deleteGame}
                    secondTextButton={dictionary.cancel}
                    secondButton={() => setDeletePopUp(false)}
                    type="delete"
                />
            </div>}
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