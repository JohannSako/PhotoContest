"use client";

import Header from "@/components/header";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import Text from "@/components/text";
import Upload from "@/components/photo/upload";
import Carousel from "@/components/photo/carousel";

export default function GameVoting({ contest, gamemaster, theme, photos }) {
    const router = useRouter();
    const [isGameMaster, setIsGameMaster] = useState(false);
    const [photo, setPhoto] = useState('');
    const [index, setIndex] = useState(0);

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

    const handlePhotoChange = (image) => {
        setPhoto(image);
    };

    return (
        <div className="flex h-[100vh] items-center flex-col gap-6 bg-gray-800">
            <div className="items-center gap-10 bg-primary w-full p-4 z-10">
                <Header
                    title="Game"
                    left="Back"
                    leftFunction={() => router.back()}
                    right={isGameMaster ? "Settings" : ""}
                    rightFunction={isGameMaster ? (() => router.push('/game/settings')) : undefined}
                    mainColor="white"
                    buttonColor="white"
                />
                <div className="flex flex-row w-full gap-8 justify-center pt-10">
                    <Text color="white" size="14px" weight="900">NOW VOTING</Text>
                    <div className="flex flex-row gap-1">
                        <Text color="white" size="14px" weight="500">Theme:</Text>
                        <div>
                            <Text color="white" size="14px" weight="700">{theme.title.toUpperCase()}</Text>
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute w-full h-full overflow-hidden">
                <img className="w-full h-full object-cover blur-[10px] opacity-30" src={photos[index].photo} alt="Background" />
            </div>
            <div className="text-end">
                <Carousel photos={photos} setIndex={setIndex} />
                {photo && <Text color="#5DB075" size="14px" weight="500">waiting for the voting time</Text>}
            </div>
        </div>
    )
}