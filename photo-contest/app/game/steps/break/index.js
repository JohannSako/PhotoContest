"use client";

import Header from "@/components/header";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import Text from "@/components/text";
import toast from "react-hot-toast";
import Image from "next/image";
import { useTranslation } from "@/context/TranslationContext";

export default function GameBreak({ photos, theme, gamemaster, gameId }) {
    const router = useRouter();
    const [isGameMaster, setIsGameMaster] = useState(false);
    const [photo, setPhoto] = useState({});
    const { dictionary } = useTranslation();

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
    }, [gamemaster]);

    useEffect(() => {
        let winner = photos.length > 0 ? photos[0] : null;

        photos.forEach((current_photo) => {
            if (winner.votes.length < current_photo.votes.length) {
                winner = current_photo;
            }
        })
        setPhoto(winner);
    }, [photos])

    return (
        <div className="flex items-center flex-col p-4 gap-10 h-[100vh] overflow-hidden">
            <div className="relative w-full h-full">
                <div className="relative z-10 w-full h-full flex flex-col items-center gap-6">
                    <Header
                        title={dictionary.game}
                        left={dictionary.back}
                        leftFunction={() => router.back()}
                        right={isGameMaster ? dictionary.settings : ""}
                        rightFunction={isGameMaster ? (() => router.push(`/game/settings?_id=${gameId}`)) : undefined}
                    />
                    <div className="flex flex-row w-full gap-8 justify-center pt-4">
                        <Text color="#5DB075" size="14px" weight="900">{dictionary.result}</Text>
                        <div className="flex flex-row gap-1">
                            <Text color="#5DB075" size="14px" weight="500">Theme:</Text>
                            <div>
                                <Text color="#5DB075" size="14px" weight="700">{theme.title.toUpperCase()}</Text>
                            </div>
                        </div>
                    </div>
                    <div className="text-end">
                        <div className={`flex w-[70vw] h-[70vh] items-center justify-center`}>
                            {photo ? <img src={photo.photo} alt="Selected" className={`w-full h-full object-cover rounded-md`} /> : (
                                <div className="flex w-full text-center">
                                    <Text>{dictionary.believeNoWinner}</Text>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-row justify-between items-end">
                            <div className="flex mb-[3px]">
                                <Text color="#5DB075" size="14px" weight="700">{dictionary.winner}: </Text>
                            </div>
                            {(photo && photo.user) ? <Text color="#5DB075" size="20px" weight="700">{photo.user.name}</Text> : (
                                <div className="ml-1 mb-[3px]">
                                    <Text size="14px">{dictionary.makesThisGuyUseless}</Text>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}