"use client";

import Header from "@/components/header";
import TextInput from "@/components/input/text";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Loader from "@/components/loader";
import Button from "@/components/input/button";
import Text from "@/components/text";
import TimeSetDuo from "@/components/time/timeSet/duo";
import TimeSetCheck from "@/components/time/timeSet/check";
import TimePicker from "@/components/time/timePicker";
import Cookies from "js-cookie";

function GameSettingsContestTime() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [endVoteTime, setEndVoteTime] = useState(null);
    const [playersVoted, setPlayersVoted] = useState(false);

    const [showingType, setShowingType] = useState("");

    const _id = searchParams.get('_id');

    useEffect(() => {
        async function fetchGame() {
            try {
                const response = await fetch(`/api/game/${_id}`);
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Failed to fetch data');
                }

                setGame(result.game);

                setStartTime(new Date(result.game.startUpload));
                setEndTime(new Date(result.game.endUpload));
                setEndVoteTime(new Date(result.game.endVote));
                setPlayersVoted(result.game.whenPlayersVoted);
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
            const response = await fetch(`/api/game/settings/${_id}/contestTime`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('token')}`
                },
                body: JSON.stringify({
                    startUpload: startTime.getTime(),
                    endUpload: endTime.getTime(),
                    endVote: endVoteTime.getTime(),
                    whenPlayersVoted: playersVoted
                }),
            });
            const result = await response.json();
            if (response.ok) {
                alert('Contest times updated successfully');
                router.back();
            } else {
                alert(result.error || 'Failed to update contest times');
            }
        } catch (err) {
            alert('Error updating contest times');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const dateToHMString = (date) => {
        let formattedString = "";

        formattedString += date.getHours() > 9 ? date.getHours() : "0" + date.getHours();
        formattedString += ":";
        formattedString += date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes();
        return formattedString;
    }

    const handleShowingPicker = (type) => {
        setShowingType(type);
    }

    const handleValidateShowingTime = (date) => {
        switch (showingType) {
            case "START":
                setStartTime(date);
                break;
            case "END":
                setEndTime(date);
                break;
            case "END_VOTE":
                setEndVoteTime(date);
                break;
            default:
                break;
        }
        setShowingType("");
    }

    return (
        <div className="flex h-[100vh] items-center flex-col p-4 justify-between">
            {loading && <Loader />}
            <div className="flex items-center flex-col p-4 gap-[58px]">
                <Header
                    title="Game Settings"
                    left="Back"
                    leftFunction={() => router.back()}
                    right="Apply"
                    rightFunction={handleApply}
                />
                {showingType && (
                    <div className="absolute inset-0 flex justify-center items-center z-10">
                        <TimePicker
                            cancelPicker={() => setShowingType("")}
                            savePicker={handleValidateShowingTime}
                            time={showingType == "START" ? startTime : (showingType == "END" ? endTime : endVoteTime)}
                        />
                    </div>
                )}
                <div className="flex flex-col w-[90vw] gap-6">
                    <div className="flex flex-col gap-3">
                        <Text color="#4B9460" weight="600">UPLOADING</Text>
                        <div>
                            <div className="flex flex-row">
                                <div className="flex w-[50%]">
                                    <Text size={13}>CONTEST STARTING TIME</Text>
                                </div>
                                <div className="flex w-[50%]">
                                    <Text size={13}>CONTEST ENDING TIME</Text>
                                </div>
                            </div>
                            <TimeSetDuo
                                firstValue={dateToHMString(startTime)}
                                secondValue={dateToHMString(endTime)}
                                firstOnClick={() => handleShowingPicker("START")}
                                secondOnClick={() => handleShowingPicker("END")}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Text color="#4B9460" weight="600">VOTING</Text>
                        <div>
                            <Text size={13}>CONTEST ENDING TIME</Text>
                            <TimeSetCheck
                                timeValue={dateToHMString(endVoteTime)}
                                onClick={() => handleShowingPicker("END_VOTE")}
                                checkBoxText="When players voted"
                                state={playersVoted}
                                setState={() => setPlayersVoted(!playersVoted)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function GameSettingsContestTimeWrapper() {
    return (
        <Suspense fallback={<Loader />}>
            <GameSettingsContestTime />
        </Suspense>
    );
}