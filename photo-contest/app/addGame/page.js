"use client";

import Header from "@/components/header";
import SegmentedControl from "@/components/segmentedControl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CreateGame from "./create";
import JoinGame from "./join";
import Cookies from "js-cookie";
import Loader from "@/components/loader";
import toast from "react-hot-toast";
import { useTranslation } from "@/context/TranslationContext";

export default function AddGame() {
    const router = useRouter();
    const [index, setIndex] = useState(0);
    const [categories, setCategories] = useState([]);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const {dictionary} = useTranslation();

    const handleCreate = async () => {
        try {
            if (title.length === 0) {
                toast.error(dictionary.titleCantEmpty);
                return;
            }
            setLoading(true);
            const response = await fetch('/api/game', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('token')}`
                },
                body: JSON.stringify({ title, categories: categories.map(cat => cat._id) })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Game created successfully');
                router.back();
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            console.error('Error creating game:', error.message);
            toast.error('Error creating game');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center flex-col p-4">
            {loading && <Loader />}
            <Header
                title={dictionary.addGame}
                left={dictionary.back}
                leftFunction={() => router.back()}
                right={dictionary.create}
                rightFunction={handleCreate}
            />
            <div className="flex pt-10">
                <SegmentedControl
                    firstText={dictionary.create}
                    secondText={dictionary.join}
                    index={index}
                    setIndex={setIndex}
                />
            </div>
            {
                index === 0 ?
                <CreateGame title={title} setTitle={setTitle} setActiveCategories={setCategories} /> :
                <JoinGame />
            }
        </div>
    );
}