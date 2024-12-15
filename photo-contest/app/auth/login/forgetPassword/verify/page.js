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

function AuthLoginVerify() {
    const searchParams = useSearchParams();

    const emailSet = searchParams.get('email');

    const [email, setEmail] = useState(emailSet);
    const [code, setCode] = useState('');
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const { dictionary } = useTranslation();

    const handleEmail = (e) => {
        setEmail(e.target.value)
    }

    const handleCode = (e) => {
        setCode(e.target.value)
    }

    const verify = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/auth/forgetPassword/code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mail: email, code }),
            });
            const data = await response.json();
            if (response.ok) {
                router.push(`/auth/login/forgetPassword/validate?email=${email}`);
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error(error)
            console.error('Error verifying code:', error);
        } finally {
            setLoading(false);
        }
    };

    const resendCode = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/auth/forgetPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mail: email }),
            });

            const data = await response.json();

            console.log('Response data:', data);

            if (response.ok) {
                toast.success("Code has been successfully sent !");
            } else {
                toast.error(data.error || 'Something went wrong');
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
            console.error('Error sending code:', error);
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
            <div className="flex flex-col gap-4 items-center pt-[72px]">
                <TextInput value={email} onChange={handleEmail} placeholder={dictionary.email} />
                <TextInput value={code} onChange={handleCode} placeholder={dictionary.code} />
            </div>
            <div className="flex w-full justify-end pb-[26px]">
                <div className="text-end pt-[9px] active:opacity-50" onClick={resendCode}>
                    <Text size="12px" weight="600" color="white">{dictionary.resendCode}</Text>
                </div>
            </div>
            <Button text={dictionary.verify} type="secondary" width="343px" onClick={verify} />
        </div>
    )
}

export default function AuthLoginVerifyWrapper() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AuthLoginVerify />
        </Suspense>
    );
}
