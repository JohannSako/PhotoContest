"use client";

import IconSlogan from "@/components/icon/slogan";
import TextInput from "@/components/input/text";
import Button from "@/components/input/button";
import Header from "@/components/header";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Text from "@/components/text";
import Loader from "@/components/loader";
import toast from "react-hot-toast";
import { useTranslation } from "@/context/TranslationContext";

function AuthLoginValidate() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const { dictionary } = useTranslation();

    const email = searchParams.get('email');

    const handlePassword = (e) => {
        setPassword(e.target.value)
    }

    const handleConfirmPassword = (e) => {
        setConfirmPassword(e.target.value)
    }

    const validate = async () => {
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch('/api/auth/forgetPassword/change', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mail: email, password: password }),
            });
            const data = await response.json();
            if (response.ok) {
                toast.success('Password reset successfully');
                router.push('/auth/login');
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error(error);
            console.error('Error resetting password:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        router.back();
    }

    return (
        <div className="flex w-full h-[100vh] bg-primary items-center flex-col p-12">
            {loading && <Loader />}
            <Header title="" left={dictionary.back} leftFunction={handleBack} buttonColor="white" />
            <div className="flex pt-10">
                <IconSlogan />
            </div>
            <div className="flex flex-col gap-4 items-center pt-[72px] pb-[54px]">
                <TextInput value={password} onChange={handlePassword} placeholder={dictionary.password} show={true} type="password" />
                <TextInput value={confirmPassword} onChange={handleConfirmPassword} placeholder={dictionary.confirmPassword} show={true} type="password" />
            </div>
            <Button text={dictionary.validate} type="secondary" width="343px" onClick={validate} />
        </div>
    )
}

export default function AuthLoginValidateWrapper() {
    return (
        <Suspense fallback={<Loader />}>
            <AuthLoginValidate />
        </Suspense>
    );
}
