"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Carousel from "@/components/photo/carousel";
import Text from "@/components/text";
import Header from "@/components/header";
import { useRouter } from "next/navigation";

export default function ContestHistory() {
    const searchParams = useSearchParams();
    const _id = searchParams.get('_id');
    const [contest, setContest] = useState(null);
    const [theme, setTheme] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        async function fetchContest() {
            try {
                const response = await fetch(`/api/contest/${_id}`);
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Failed to fetch data');
                }

                setContest(result.contest);
                setPhotos(result.photos);
                setTheme(result.theme);
            } catch (err) {
                toast.error(err.message);
            } finally {
                setLoading(false);
            }
        }

        if (_id) {
            fetchContest();
        }
    }, [_id]);

    return (
        <div className="flex h-[100vh] items-center flex-col gap-6 bg-gray-800">
            {loading && <Loader />}
            <div className="items-center gap-10 bg-primary w-full p-4 z-10">
                <Header
                    title="Game"
                    left="Back"
                    leftFunction={() => router.back()}
                    mainColor="white"
                    buttonColor="white"
                />
                <div className="flex flex-row w-full gap-8 justify-center pt-10">
                    <div className="flex flex-row gap-1">
                        <Text color="white" size="14px" weight="500">Theme:</Text>
                        <div>
                            <Text color="white" size="14px" weight="700">{theme && theme.title.toUpperCase()}</Text>
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute w-full h-full overflow-hidden">
                {photos.length > 0 && <img className="w-full h-full object-cover blur-[10px] opacity-30" src={photos[index].photo} alt="Background" />}
            </div>
            <div className="flex flex-col h-full text-end items-center justify-center gap-4">
                {photos.length > 0 ? <Carousel photos={photos} setIndex={setIndex} /> : (
                    <div className="flex text-center">
                        <Text color="white">Well looks like no one felt like posting pictures this day..</Text>
                    </div>
                )}
                {photos.length > 0 && <Text color="white">{photos[index].user.name}</Text>}
            </div>
        </div>
    );
};