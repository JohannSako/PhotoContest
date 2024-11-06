"use client";

import IconSlogan from "@/components/icon/slogan"
import TextInput from "@/components/input/text"
import Button from "@/components/input/button"
import Header from "@/components/header"
import { useState } from "react"
import { useRouter } from "next/navigation";

export default function AuthLoginSendCode() {
    const [email, setEmail] = useState('')
    const router = useRouter();

    const handleEmail = (e) => {
        setEmail(e.target.value)
    }

    const sendCode = async () => {
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
                router.push(`/auth/login/forgetPassword/verify?email=${email}`);
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
            <div className="flex flex-col gap-4 items-center pt-[72px] pb-[120px]">
                <TextInput value={email} onChange={handleEmail} placeholder="Email" />
            </div>
            <Button text="Send code" type="secondary" width="343px" onClick={sendCode} />
        </div>
    )
}