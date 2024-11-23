"use client";

import Header from "@/components/header";
import SearchInput from "@/components/input/search";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Loader from "@/components/loader";
import Button from "@/components/input/button";
import Category from "@/components/category";
import Cookies from "js-cookie";

function GameSettingsCategories() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [title, setTitle] = useState('');
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const _id = searchParams.get('_id');

    useEffect(() => {
        async function fetchGame() {
            try {
                const response = await fetch(`/api/game/${_id}`);
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Failed to fetch data');
                }

                setSelectedCategories(result.game.categories || []);
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

    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await fetch('/api/category');
                const data = await response.json();
                if (response.ok) {
                    setCategories(data);
                    setFilteredCategories(data);
                } else {
                    alert('Failed to load categories');
                }
            } catch (err) {
                alert('Error fetching categories');
            }
        }

        fetchCategories();
    }, []);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = categories.filter(category =>
            category.title.toLowerCase().includes(query)
        );
        setFilteredCategories(filtered);
        setTitle(e.target.value);
    };

    const handleApply = async () => {
        try {
            const response = await fetch(`/api/game/settings/${_id}/categories`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('token')}`
                },
                body: JSON.stringify({ categories: selectedCategories }),
            });
            const result = await response.json();
            if (response.ok) {
                alert('Categories updated successfully');
                router.back();
            } else {
                alert(result.error || 'Failed to update categories');
            }
        } catch (err) {
            alert('Error updating categories');
            console.error(err);
        }
    };

    const toggleCategoryState = (id) => {
        setSelectedCategories((prevState) => {
            if (prevState.includes(id)) {
                return prevState.filter((categoryId) => categoryId !== id);
            } else {
                return [...prevState, id];
            }
        });
    };

    if (loading) return <Loader />;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="flex h-[100vh] items-center flex-col p-4 justify-between">
            <div className="flex items-center flex-col p-4 gap-[21px]">
                <Header
                    title="Game Settings"
                    left="Back"
                    leftFunction={() => router.back()}
                    right="Apply"
                    rightFunction={handleApply}
                />
                <SearchInput
                    value={title}
                    onChange={handleSearch}
                    placeholder="Search categories"
                />
                <div className="grid grid-cols-2 gap-[29px] pt-[21px]">
                    {filteredCategories.map((category) => (
                        <Category
                            key={category._id}
                            text={category.title}
                            icon={category.icon}
                            state={selectedCategories.includes(category._id)}
                            setState={() => toggleCategoryState(category._id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function GameSettingsCategoriesWrapper() {
    return (
        <Suspense fallback={<Loader />}>
            <GameSettingsCategories />
        </Suspense>
    );
}
