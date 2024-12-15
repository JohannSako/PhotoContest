"use client";

import Header from "@/components/header";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import Text from "@/components/text";
import Upload from "@/components/photo/upload";
import GameTheme from "../theme";
import Loader from "@/components/loader";
import toast from "react-hot-toast";
import { useTranslation } from "@/context/TranslationContext";

export default function GameUploading({ contest, gamemaster, theme, category, gameId, photos }) {
    const router = useRouter();
    const [isGameMaster, setIsGameMaster] = useState(false);
    const [photo, setPhoto] = useState('');
    const [showTheme, setShowTheme] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showThemeLoading, setShowThemeLoading] = useState(true);
    const { dictionary, locale } = useTranslation();

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
            toast.error(error);
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
        setShowThemeLoading(false);
    }, [contest._id]);

    useEffect(() => {
        const token = Cookies.get('token');
        let decoded;
        try {
            decoded = jwtDecode(token);
            const userId = decoded.userId;
            for (let it = 0; it < photos.length; it++) {
                if (userId === photos[it].user_id) {
                    setPhoto(photos[it].photo);
                }
            }
        } catch (error) {
            toast.error(error);
            console.log('Error decoding token:', error);
        }
    }, [photos])

    const handleLeavingTheme = () => {
        setShowTheme(false);
    }

    const handlePhotoChange = async (image) => {
        setPhoto(image);
        try {
            setLoading(true);
            const response = await fetch(`/api/contest/upload/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('token')}`
                },
                body: JSON.stringify({
                    photo: image,
                    contestId: contest._id
                }),
            });
            const result = await response.json();
            if (response.ok) {
                toast.success('Picture set successfully');
            } else {
                toast.error(result.error || 'Failed to set picture');
            }
        } catch (err) {
            toast.error('Error setting picture');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (showTheme)
        return <GameTheme theme={theme} category={category} handleLeaveTheme={handleLeavingTheme} />
    else if (showThemeLoading)
        return <Loader />

    return (
        <div className="flex items-center flex-col p-4 gap-10">
            {loading && <Loader />}
            <Header
                title={dictionary.game}
                left={dictionary.back}
                leftFunction={() => router.back()}
                right={isGameMaster ? dictionary.settings : ""}
                rightFunction={isGameMaster ? (() => router.push(`/game/settings?_id=${gameId}`)) : undefined}
            />
            <div className="flex flex-row w-full gap-8 justify-center">
                <Text color="#5DB075" size="14px" weight="900">{dictionary.nowUploading}</Text>
                <div className="flex flex-row gap-1">
                    <Text color="#5DB075" size="14px" weight="500">Theme:</Text>
                    <div>
                        <Text color="#5DB075" size="14px" weight="700">{locale === 'fr' ? dictionary[theme.title].toUpperCase() : theme.title.toUpperCase()}</Text>
                    </div>
                </div>
            </div>
            <div className="text-end">
                <Upload onImageChange={handlePhotoChange} defaultImage={photo ? photo : ''} />
                {photo && <Text color="#5DB075" size="14px" weight="500">{dictionary.waitingForTheVotingTime}</Text>}
            </div>
        </div>
    )
}