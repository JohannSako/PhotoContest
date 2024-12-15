import Button from "@/components/input/button";
import TextInput from "@/components/input/text";
import Loader from "@/components/loader";
import { useTranslation } from "@/context/TranslationContext";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function JoinGame() {
    const [code, setCode] = useState('');
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { dictionary } = useTranslation();

    const handleCodeChange = (e) => {
        setCode(e.target.value);
    }

    const handleJoin = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/game/join/${code}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('token')}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Joined game successfully');
                router.back()
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            console.error('Error joining game:', error.message);
            toast.error('Error joining game');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex h-[70vh] items-center justify-center flex-col gap-[39px]">
            {loading && <Loader />}
            <TextInput
                value={code}
                onChange={handleCodeChange}
                placeholder={dictionary.code}
            />
            <Button
                width="340px"
                text={dictionary.join}
                onClick={handleJoin}
            />
        </div>
    );
}