"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import ScoreProfile from "@/components/content/scoreProfile";
import Loader from "@/components/loader";
import Header from "@/components/header";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/context/TranslationContext";

function Ranking() {
    const searchParams = useSearchParams();
    const gameId = searchParams.get('_id');
    const { dictionary } = useTranslation();

    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!gameId) {
            toast.error('ID de la game manquant');
            setLoading(false);
            return;
        }

        const getParticipantsWithScore = async () => {
            try {
                const response = await fetch(`/api/game/${gameId}/ranking`);
                if (!response.ok) {
                    throw new Error(`Erreur ${response.status}`);
                }
                const data = await response.json();
                setParticipants(data.users);
            } catch (err) {
                toast.error('Can\t find ranking, try again later');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        getParticipantsWithScore();
    }, [gameId]);

    if (loading) {
        return <Loader />;
    }

    if (participants.length === 0) {
        return <div className="text-center mt-8">No participants found or no ranking available for now.</div>;
    }

    return (
        <div className="flex h-[100vh] items-center flex-col p-4 justify-between">
            {loading && <Loader />}
            <div className="flex items-center flex-col p-4 gap-[21px]">
                <Header
                    title={dictionary.ranking}
                    left={dictionary.back}
                    leftFunction={() => router.back()}
                />
                <div className="grid gap-[16px] pt-[21px]">
                    {participants.map(({ user, score }) => (
                        <ScoreProfile key={user._id} name={user.name} picture={user.profilePicture} score={score} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function RankingWrapper() {
    return (
        <Suspense fallback={<Loader />}>
            <Ranking />
        </Suspense>
    );
}
