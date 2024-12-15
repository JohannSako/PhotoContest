"use client";

import Month from "@/components/calendar/month";
import Text from "@/components/text";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Loader from "@/components/loader";
import toast from "react-hot-toast";
import Header from "@/components/header";
import { Suspense } from "react";
import { useTranslation } from "@/context/TranslationContext";

function HomeCalendar() {
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { dictionary } = useTranslation();

    const searchParams = useSearchParams();
    const _id = searchParams.get('_id');

    useEffect(() => {
        async function fetchGame() {
            setLoading(true);
            try {
                const response = await fetch(`/api/game/${_id}/contests`);
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Failed to fetch data');
                }

                const fetchedContests = result.contests || [];

                fetchedContests.sort((a, b) => a.date - b.date);

                setContests(fetchedContests);
            } catch (err) {
                toast.error(err.message);
            } finally {
                setLoading(false);
            }
        }

        if (_id) {
            fetchGame();
        }
    }, [_id]);

    if (loading) {
        return (
            <div className="flex h-[100vh] bg-primary items-center justify-center">
                <Loader />
            </div>
        );
    }

    if (contests.length === 0) {
        return (
            <div className="flex h-[100vh] bg-primary items-center justify-center">
                <Text color="#FFF">No contests found.</Text>
            </div>
        );
    }

    const contestsByMonthYear = {};
    for (const contest of contests) {
        const date = new Date(contest.date);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const key = `${year}-${month}`;

        if (!contestsByMonthYear[key]) {
            contestsByMonthYear[key] = [];
        }
        contestsByMonthYear[key].push(contest);
    }

    const sortedKeys = Object.keys(contestsByMonthYear).sort((a, b) => {
        const [yearA, monthA] = a.split('-').map(Number);
        const [yearB, monthB] = b.split('-').map(Number);

        if (yearA !== yearB) return yearA - yearB;
        return monthA - monthB;
    });

    const navigateToContest = (contestId) => {
        router.push(`/home/calendar/contest?_id=${contestId}`);
    }

    return (
        <div className="flex flex-col items-center bg-primary min-h-screen py-4 gap-5">
            <Header
                title={dictionary.calendar}
                left={dictionary.back}
                right={dictionary.ranking}
                mainColor="white"
                buttonColor="white"
                leftFunction={() => router.back()}
                rightFunction={() => router.push(`/home/calendar/ranking?_id=${_id}`)}
            />
            {sortedKeys.map(key => {
                const [year, month] = key.split('-').map(Number);
                const monthContests = contestsByMonthYear[key];
                return (
                    <div key={key} className="mb-8">
                        <Month monthNb={month} year={year} contests={monthContests} handleClick={navigateToContest} />
                    </div>
                );
            })}
        </div>
    );
}

export default function HomeCalendarWrapper() {
    return (
        <Suspense fallback={<Loader />}>
            <HomeCalendar />
        </Suspense>
    );
}