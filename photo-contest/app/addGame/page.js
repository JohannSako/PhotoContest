"use client";

import Header from "@/components/header";
import SegmentedControl from "@/components/segmentedControl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CreateGame from "./create";
import JoinGame from "./join";
import Cookies from "js-cookie";
import Loader from "@/components/loader";

export default function AddGame() {
    const router = useRouter();
    const [index, setIndex] = useState(0);
    const [categories, setCategories] = useState([]);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        try {
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
                alert('Game created successfully');
                router.back();
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Error creating game:', error.message);
            alert('Error creating game');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center flex-col p-4">
            {loading && <Loader />}
            <Header
                title="Add Game"
                left="Back"
                leftFunction={() => router.back()}
                right="Create"
                rightFunction={handleCreate}
            />
            <div className="flex pt-10">
                <SegmentedControl
                    firstText="Create"
                    secondText="Join"
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