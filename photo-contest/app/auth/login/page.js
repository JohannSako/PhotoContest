"use client";

import IconSlogan from "@/components/icon/slogan";
import Button from "@/components/input/button";
import TextInput from "@/components/input/text";
import Text from "@/components/text";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";

export default function AuthLogin() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLoginChange = (e) => {
        setLogin(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleLogin = async () => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mail: login, password }),
            });

            const data = await response.json();

            if (response.ok) {
                Cookies.set('token', data.token, { expires: 7 });
                router.push('/home/');
            } else {
                alert(data.error);
            }
        } catch (error) {
            alert('Error logging in. Please try again.');
            console.error('Error logging in:', error);
        }
    };

    return (
        <div className="flex w-full h-[100vh] bg-primary items-center flex-col p-12">
            <div className="flex pt-10">
                <IconSlogan />
            </div>
            <div className="flex flex-col gap-4 items-center pt-[72px]">
                <TextInput value={login} onChange={handleLoginChange} placeholder="Email" />
                <TextInput value={password} onChange={handlePasswordChange} show={true} placeholder="Password" type="password" />
            </div>
            <div className="flex w-full justify-end pb-[26px]">
                <Link className="text-end pt-[9px]" href="/auth/login/forgetPassword/sendCode">
                    <Text size="12px" weight="600" color="white">Forgot your password?</Text>
                </Link>
            </div>
            <Button text="Log in" type="secondary" width="343px" onClick={handleLogin} />
            <div className="flex flex-row pt-[146px] gap-[5px]">
                <Text weight="500" color="white">Don’t have an account ?</Text>
                <Link href="/auth/register/credentials">
                    <Text weight="700" color="white">Sign Up</Text>
                </Link>
            </div>
        </div>
    )
}