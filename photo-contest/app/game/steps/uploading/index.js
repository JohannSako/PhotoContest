"use client";

import Header from "@/components/header";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import Text from "@/components/text";
import Upload from "@/components/photo/upload";
import GameTheme from "../theme";

export default function GameUploading({ contest, gamemaster, theme, category, gameId }) {
    const router = useRouter();
    const [isGameMaster, setIsGameMaster] = useState(false);
    const [photo, setPhoto] = useState('');
    const [showTheme, setShowTheme] = useState(false);

    useEffect(() => {
        const token = Cookies.get('token');
        let decoded;
        try {
            decoded = jwtDecode(token);
            const userId = decoded.userId;
            if (userId === gamemaster) {
                setIsGameMaster(true);
            }
        } catch (error) {
            alert(error);
            console.log('Error decoding token:', error);
        }
    }, [gamemaster])

    useEffect(() => {
        const seenContests = JSON.parse(localStorage.getItem('seenContests')) || [];
        if (!seenContests.includes(contest._id)) {
            setShowTheme(true);
            seenContests.push(contest._id);
            localStorage.setItem('seenContests', JSON.stringify(seenContests));
        }
    }, [contest._id]);

    const handleLeavingTheme = () => {
        setShowTheme(false);
    }

    const handlePhotoChange = (image) => {
        setPhoto(image);
    };

    if (showTheme)
        return <GameTheme theme={theme} category={category} handleLeaveTheme={handleLeavingTheme} />

    return (
        <div className="flex items-center flex-col p-4 gap-10">
            <Header
                title="Game"
                left="Back"
                leftFunction={() => router.back()}
                right={isGameMaster ? "Settings" : ""}
                rightFunction={isGameMaster ? (() => router.push(`/game/settings?_id=${gameId}`)) : undefined}
            />
            <div className="flex flex-row w-full gap-8 justify-center">
                <Text color="#5DB075" size="14px" weight="900">NOW UPLOADING</Text>
                <div className="flex flex-row gap-1">
                    <Text color="#5DB075" size="14px" weight="500">Theme:</Text>
                    <div>
                        <Text color="#5DB075" size="14px" weight="700">{theme.title.toUpperCase()}</Text>
                    </div>
                </div>
            </div>
            <div className="text-end">
                <Upload onImageChange={handlePhotoChange} />
                {photo && <Text color="#5DB075" size="14px" weight="500">waiting for the voting time</Text>}
            </div>
        </div>
    )
}