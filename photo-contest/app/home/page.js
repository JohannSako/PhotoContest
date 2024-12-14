"use client";

import Header from "@/components/header";
import SearchInput from "@/components/input/search";
import SearchResult from "@/components/content/searchResult";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import PopUp from "@/components/popUp";
import { jwtDecode } from "jwt-decode";
import Loader from "@/components/loader";
import toast from "react-hot-toast";

const leavePopUpInfo = {
    title: "Leaving your game",
    content: 'Are you sure you want to leave this game? This action is permanent and cannot be undone. You will lose access to this game, and all your photos and points associated with it will be permanently deleted.',
    button: 'Leave'
};

const deletePopUpInfo = {
    title: 'Deleting your game',
    content: 'Are you sure you want to delete this game? This action is permanent and cannot be undone. All associated photos, points, and game data will be permanently removed, and participants will lose access to this game.',
    button: 'Delete'
}

export default function Home() {
    const router = useRouter();
    const [input, setInput] = useState('');
    const [games, setGames] = useState([]);
    const [binPopUp, setBinPopUp] = useState(false);
    const [isGameMaster, setIsGameMaster] = useState(false);
    const [loading, setLoading] = useState(false);
    const [gameId, setGameId] = useState('');

    useEffect(() => {
        getGames();
    }, []);

    useEffect(() => {
        binPopUp
            ? (document.body.style.overflow = 'hidden')
            : (document.body.style.overflow = 'auto');
    }, [binPopUp]);

    const getGames = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/game', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('token')}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setGames(data);
            } else {
                toast.error(data.error);
            }
        } catch (err) {
            toast.error('Error fetching games');
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const handleInput = (e) => {
        setInput(e.target.value);
    }

    const filteredGames = games.filter(game =>
        game.title.toLowerCase().includes(input.toLowerCase())
    );

    const enterGame = (_id) => {
        router.push(`/game?_id=${_id}`);
    }

    const openPopUp = (gamemaster, id) => {
        const token = Cookies.get('token');
        let decoded;
        try {
            decoded = jwtDecode(token);
            const userId = decoded.userId;
            if (userId === gamemaster) {
                setIsGameMaster(true);
            }
            setGameId(id);
            setBinPopUp(true);
        } catch (error) {
            toast.error(error);
            console.log('Error decoding token:', error);
        }
    }

    const closePopUp = () => {
        setBinPopUp(false);
        setIsGameMaster(false);
        setGameId('');
    }

    const deleteGame = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/game/delete/${gameId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('token')}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                toast.success('Game has been successfully left !');
                setBinPopUp(false);
                setIsGameMaster(false);
                setGameId('');
                getGames();
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error('Error deleting game');
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex gap-8 items-center flex-col p-4">
            {loading && <Loader />}
            <Header
                title="Home"
                left="Settings"
                right="Add Game"
                leftFunction={() => router.push("/settings/")}
                rightFunction={() => router.push("/addGame/")}
            />
            <SearchInput
                placeholder="Search Game"
                value={input}
                onChange={handleInput}
            />
            <div className="flex flex-col gap-4">
                {filteredGames.map(game => (
                    <SearchResult
                        key={game._id}
                        result={game.title}
                        handleResult={() => enterGame(game._id)}
                        calendar={() => router.push(`/home/calendar?_id=${game._id}`)}
                        bin={() => openPopUp(game.gamemaster, game._id)}
                    />
                ))}
            </div>
            {binPopUp && <div className="absolute top-1/2 -translate-y-1/2">
                <PopUp
                    title={isGameMaster ? deletePopUpInfo.title : leavePopUpInfo.title}
                    content={isGameMaster ? deletePopUpInfo.content : leavePopUpInfo.content}
                    firstTextButton={isGameMaster ? deletePopUpInfo.button : leavePopUpInfo.button}
                    firstButton={deleteGame}
                    secondTextButton="Cancel"
                    secondButton={() => closePopUp()}
                    type="delete"
                />
            </div>}
        </div>
    )
}
