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

    const [subscribed, setSubscribed] = useState(false);

    const [showNotificationPopup, setShowNotificationPopup] = useState(false);

    useEffect(() => {
        if (subscribed) {
            toast.dismiss();
            toast.success("You can now receive notifications !");
        } else {
            toast.loading("Checking notifications..");
        }
    }, [subscribed])

    useEffect(() => {        
        getGames();

        if ('Notification' in window) {
            if (Notification.permission === 'default') {
                toast.dismiss();
                setShowNotificationPopup(true);
            } else if (Notification.permission === 'granted') {
                askNotificationPermission();
            } else {
                saveSubscriptionToDB(null);
                toast.dismiss();
                toast.error("You have previously denied notifications. You can update this in your browser settings.");
            }
        } else {
            toast.dismiss();
            toast.error("Your navigator does not support push notifications.");
        }
    }, []);

    useEffect(() => {
        binPopUp ?
            (document.body.style.overflow = 'hidden') :
            (document.body.style.overflow = 'auto')
    }, [binPopUp])

    async function askNotificationPermission() {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            toast.dismiss();
            toast.error("Your navigator does not support push notifications.");
            return;
        }

        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            await saveSubscriptionToDB(null);
            return;
        }

        const reg = await navigator.serviceWorker.ready;
        const existingSub = await reg.pushManager.getSubscription();

        if (!existingSub) {
            const subscribeOptions = {
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY)
            };
            const newSub = await reg.pushManager.subscribe(subscribeOptions);

            await saveSubscriptionToDB(newSub);
            setSubscribed(true);
        } else {
            await saveSubscriptionToDB(existingSub);
            setSubscribed(true);
        }
    }

    async function saveSubscriptionToDB(subscription) {
        const token = Cookies.get('token');
        if (!token) return;

        const res = await fetch('/api/notification/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ subscription })
        });

        const data = await res.json();
        if (!res.ok) {
            toast.dismiss();
            toast.error(data.error || 'Error while saving subscription.');
        } else {
            toast.dismiss();
            toast.success('Notification preferences updated !');
        }
    }

    function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');
        const rawData = atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

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

    const handleAcceptNotifications = async () => {
        setShowNotificationPopup(false);
        await askNotificationPermission();
    }

    const handleDeclineNotifications = async () => {
        setShowNotificationPopup(false);
        await saveSubscriptionToDB(null);
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

            {showNotificationPopup && (
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
                    <PopUp
                        title="Enable Notifications?"
                        content="Would you like to receive notifications for upcoming contests, reminders, and updates? This will help you stay informed about the latest events."
                        firstTextButton="Accept"
                        firstButton={handleAcceptNotifications}
                        secondTextButton="No, thanks"
                        secondButton={handleDeclineNotifications}
                        type="primary"
                    />
                </div>
            )}
        </div>
    )
}
