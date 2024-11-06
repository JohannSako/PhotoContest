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

export default function AuthLoginValidate() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();

    const email = searchParams.get('email');

    const handlePassword = (e) => {
        setPassword(e.target.value)
    }

    const handleConfirmPassword = (e) => {
        setConfirmPassword(e.target.value)
    }

    const validate = async () => {
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            const response = await fetch('/api/auth/forgetPassword/change', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mail: email, password: password }),
            });
            const data = await response.json();
            if (response.ok) {
                alert('Password reset successfully');
                router.push('/auth/login');
            } else {
                alert(data.error);
            }
        } catch (error) {
            alert(error);
            console.error('Error resetting password:', error);
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
            <div className="flex flex-col gap-4 items-center pt-[72px] pb-[54px]">
                <TextInput value={password} onChange={handlePassword} placeholder="Password" show={true} type="password" />
                <TextInput value={confirmPassword} onChange={handleConfirmPassword} placeholder="Confirm password" show={true} type="password" />
            </div>
            <Button text="Validate" type="secondary" width="343px" onClick={validate} />
        </div>
    )
}