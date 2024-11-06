"use client";

import IconSlogan from "@/components/icon/slogan";
import Button from "@/components/input/button";
import TextInput from "@/components/input/text";
import Text from "@/components/text";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";

export default function AuthRegisterCredentials() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleRegister = () => {
        if (typeof email !== 'string' || !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)))
            alert("Invalid email address");
        else if (!(typeof password === 'string' && password.length >= 6))
            alert("Invalid password");
        else
            router.push(`/auth/register/details?email=${email}&password=${password}`)
    };

    return (
        <div className="flex w-full h-[100vh] bg-primary items-center flex-col p-12">
            <div className="flex pt-10">
                <IconSlogan />
            </div>
            <div className="flex flex-col gap-4 items-center pt-[72px] pb-[54px]">
                <TextInput value={email} onChange={handleEmailChange} placeholder="Email" />
                <TextInput value={password} onChange={handlePasswordChange} show={true} placeholder="Password" type="password" />
            </div>
            <Button text="Continue" type="secondary" width="343px" onClick={handleRegister} />
            <div className="flex flex-row pt-[146px] gap-[5px]">
                <Text weight="500" color="white">Already have an account ?</Text>
                <Link href="/componentsExample">
                    <Text weight="700" color="white">Log In</Text>
                </Link>
            </div>
        </div>
    )
}