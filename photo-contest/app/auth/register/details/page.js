"use client";

import IconSlogan from "@/components/icon/slogan";
import Button from "@/components/input/button";
import TextInput from "@/components/input/text";
import Text from "@/components/text";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/header";
import Upload from "@/components/photo/upload";
import Loader from "@/components/loader";
import toast from "react-hot-toast";
import { useTranslation } from "@/context/TranslationContext";

function AuthRegisterDetails() {
    const [username, setUsername] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const searchParams = useSearchParams();

    const email = searchParams.get('email');
    const password = searchParams.get('password');

    const { dictionary } = useTranslation();

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handleBack = () => {
        router.back();
    }

    const handleProfilePictureChange = (image) => {
        setProfilePicture(image);
    };

    const handleRegister = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: username, mail: email.replace(' ', '+'), password: password, profilePicture: profilePicture }),
            });

            const data = await response.json();

            if (response.ok) {
                router.push('/auth/login');
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error('Error during register. Please try again.');
            console.error('Error during register:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex w-full h-[100vh] bg-primary items-center flex-col p-12">
            {loading && <Loader />}
            <Header title="" left={dictionary.back} leftFunction={handleBack} buttonColor="white" />
            <div className="flex pt-10">
                <IconSlogan />
            </div>
            <div className="flex flex-col items-center pt-[34px] pb-[14px] gap-10">
                <Upload width="w-[158px]" height="h-[158px]" border="rounded-full" borderColor="border-white" onImageChange={handleProfilePictureChange} />
                <TextInput value={username} onChange={handleUsernameChange} placeholder={dictionary.username} />
            </div>
            <Button text={dictionary.signup} type="secondary" width="343px" onClick={handleRegister} />
        </div>
    )
}

export default function AuthRegisterDetailsWrapper() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AuthRegisterDetails />
        </Suspense>
    );
}
