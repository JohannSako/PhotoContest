"use client";

import Header from "@/components/header";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import Text from "@/components/text";
import Loader from "@/components/loader";
import Carousel from "@/components/photo/carousel";
import Like from "@/components/photo/like";
import toast from "react-hot-toast";
import Image from "next/image";

export default function GameVoting({ gamemaster, theme, photos, gameId }) {
    const router = useRouter();
    const [isGameMaster, setIsGameMaster] = useState(false);
    const [photo, setPhoto] = useState('');
    const [index, setIndex] = useState(0);
    const [like, setLike] = useState(false);
    const [likedPictureIndex, setLikedPictureIndex] = useState(-1);
    const [loading, setLoading] = useState(false);

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
        const token = Cookies.get('token');
        let decoded;
        try {
            decoded = jwtDecode(token);
            const userId = decoded.userId;
            for (let it = 0; it < photos.length; it++) {
                for (let vote of photos[it].votes) {
                    if (vote === userId) {
                        setLikedPictureIndex(it);
                        if (it === 0)
                            setLike(true);
                    }
                }
            }
        } catch (error) {
            toast.error(error);
            console.log('Error decoding token:', error);
        }
    }, [photos]);

    const handleVote = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/contest/vote/` + photos[index]._id, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('token')}`
                }
            });
            const result = await response.json();
            if (response.ok) {
                toast.error(response.status === 200 ? 'Your vote has been saved !' : 'Your vote has been updated !');
                setLikedPictureIndex(index);
                setLike(true);
            } else {
                toast.error(result.error || 'Failed to vote');
            }
        } catch (err) {
            toast.error('Error voting');
            toast.error(err);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (like && index !== likedPictureIndex)
            setLike(false);
        else if (!like && index == likedPictureIndex)
            setLike(true);
    }, [index])

    const handleLike = (state) => {
        setLike(state);
        if (index !== likedPictureIndex)
            handleVote();
    }

    return (
        <div className="flex h-[100vh] items-center flex-col gap-6 bg-gray-800">
            {loading && <Loader />}
            <div className="items-center gap-10 bg-primary w-full p-4 z-10">
                <Header
                    title="Game"
                    left="Back"
                    leftFunction={() => router.back()}
                    right={isGameMaster ? "Settings" : ""}
                    rightFunction={isGameMaster ? (() => router.push(`/game/settings?_id=${gameId}`)) : undefined}
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
                {photos.length > 0 && <img className="w-full h-full object-cover blur-[10px] opacity-30" src={photos[index].photo} alt="Background" />}
            </div>
            <div className="flex flex-col h-full text-end items-center justify-center gap-4 z-10">
                {photos.length > 0 ? <Carousel photos={photos} setIndex={setIndex} /> : (
                    <div className="flex text-center">
                        <Text color="white">Well looks like no one felt like posting pictures today.. See you tomorrow :)</Text>
                    </div>
                )}
                {photos.length > 0 && <div className="flex">
                    <Like like={like} setLike={handleLike} />
                </div>}
            </div>
        </div>
    )
}