"use client";

import IconSlogan from "@/components/icon/slogan"
import TextInput from "@/components/input/text"
import Button from "@/components/input/button"
import Header from "@/components/header"
import { useState } from "react"
import { useRouter } from "next/navigation";
import Link from "next/link";
import Text from "@/components/text";
import { useSearchParams } from "next/navigation";

export default function AuthLoginVerify() {
    const searchParams = useSearchParams();

    const emailSet = searchParams.get('email');

    const [email, setEmail] = useState(emailSet);
    const [code, setCode] = useState('');
    const router = useRouter();

    const handleEmail = (e) => {
        setEmail(e.target.value)
    }

    const handleCode = (e) => {
        setCode(e.target.value)
    }

    const verify = async () => {
        try {
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
                alert(data.error);
            }
        } catch (error) {
            alert(error)
            console.error('Error verifying code:', error);
        }
    };

    const resendCode = async () => {
        try {
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
                alert("Code has been successfully sent !");
            } else {
                alert(data.error || 'Something went wrong');
            }
        } catch (error) {
            alert('An unexpected error occurred');
            console.error('Error sending code:', error);
        }
    };

    const handleBack = () => {
        router.back();
    }

    return (
        <div className="flex w-full h-[100vh] bg-primary items-center flex-col p-12">
            <Header title="" left="Back" leftFunction={handleBack} buttonColor="white" />
            <div className="flex pt-10">
                <IconSlogan />
            </div>
            <div className="flex flex-col gap-4 items-center pt-[72px]">
                <TextInput value={email} onChange={handleEmail} placeholder="Email" />
                <TextInput value={code} onChange={handleCode} placeholder="Code" />
            </div>
            <div className="flex w-full justify-end pb-[26px]">
                <div className="text-end pt-[9px] active:opacity-50" onClick={resendCode}>
                    <Text size="12px" weight="600" color="white">Resend code?</Text>
                </div>
            </div>
            <Button text="Verify" type="secondary" width="343px" onClick={verify} />
        </div>
    )
}