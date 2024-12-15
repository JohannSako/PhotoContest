"use client";

import Header from "@/components/header";
import SearchInput from "@/components/input/search";
import SearchResult from "@/components/content/searchResult";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Loader from "@/components/loader";
import Cookies from "js-cookie";
import PopUp from "@/components/popUp";
import toast from "react-hot-toast";
import { useTranslation } from "@/context/TranslationContext";

function GameSettingsParticipants() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [participants, setParticipants] = useState(null);
    const [gamemaster, setGamemaster] = useState(null);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [participantsToRemove, setParticipantsToRemove] = useState([]);
    const [filteredParticipants, setFilteredParticipants] = useState([]);

    const { dictionary } = useTranslation();

    const _id = searchParams.get('_id');

    useEffect(() => {
        async function fetchParticipants() {
            try {
                const response = await fetch(`/api/game/settings/${_id}/participants`);
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Failed to fetch participants');
                }

                setParticipants(result.users);
                setFilteredParticipants(result.users);
                setGamemaster(result.gamemaster);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        if (_id) {
            fetchParticipants();
        }
    }, [_id]);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        if (participants && participants.length != 0) {
            setFilteredParticipants(participants.filter(participant =>
                participant.name.toLowerCase().includes(query)
            ));
        }
        setTitle(e.target.value);
    };

    const toggleParticipantRemoval = (participantId) => {
        setParticipantsToRemove((prevState) => {
            return [...prevState, participantId];
        });
        setParticipants(participants.filter(participant =>
            participant._id == participantId ? null : participant
        ))
        setFilteredParticipants(participants);
    };

    const handleApply = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/game/settings/${_id}/participants`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('token')}`,
                },
                body: JSON.stringify({ participants: participantsToRemove }),
            });
            const result = await response.json();
            if (response.ok) {
                toast.success(dictionary.participantsRemovedSuccessfully);
                router.back();
            } else {
                toast.error(result.error || 'Failed to remove participants');
            }
        } catch (err) {
            toast.error('Error removing participants');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (error) return <div>Error: {error}</div>;

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
                <SearchInput
                    value={title}
                    onChange={handleSearch}
                    placeholder={dictionary.searchParticipants}
                />
                <div className="grid gap-[16px] pt-[21px]">
                    {filteredParticipants.map((participant) => {
                        if (participant._id == gamemaster) {
                            return (
                                <SearchResult
                                    key={participant._id}
                                    result={participant.name + " (Me)"}
                                    handleResult={() => toggleParticipantRemoval(participant._id)}
                                    profilePicture={participant.profilePicture}
                                />
                            );
                        }
                        return (
                            <SearchResult
                                key={participant._id}
                                result={participant.name}
                                handleResult={() => toggleParticipantRemoval(participant._id)}
                                bin={() => toggleParticipantRemoval(participant._id)}
                                profilePicture={participant.profilePicture}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default function GameSettingsParticipantsWrapper() {
    return (
        <Suspense fallback={<Loader />}>
            <GameSettingsParticipants />
        </Suspense>
    );
}