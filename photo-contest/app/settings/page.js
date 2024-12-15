"use client";

import Header from "@/components/header";
import Button from "@/components/input/button";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PopUp from "@/components/popUp";
import { jwtDecode } from "jwt-decode";
import Loader from "@/components/loader";
import toast from "react-hot-toast";
import { useTranslation } from "@/context/TranslationContext";

export default function Settings() {
    const router = useRouter();
    const [deletePopUp, setDeletePopUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const { dictionary } = useTranslation();

    const handleLogout = () => {
        Cookies.remove('token');
        router.push('/auth/login');
    }

    const handleDeleteAccount = async () => {
        const token = Cookies.get('token');
        if (!token) {
            toast.error('You are not logged in.');
            router.push('/auth/login');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch('/api/auth/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ id: jwtDecode(token).userId })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Account deleted successfully.');
                handleLogout();
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error('Error deleting account');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex gap-[251px] items-center flex-col p-4">
            {loading && <Loader />}
            <Header
                title={dictionary.settings}
                left={dictionary.back}
                leftFunction={() => router.back()}
            />
            <div className="flex items-center gap-4 flex-col">
                <Button type="secondary" text={dictionary.logout} width="341px" onClick={handleLogout} />
                <Button type="delete" text={dictionary.deleteAccount} width="341px" onClick={() => setDeletePopUp(true)} />
            </div>
            {deletePopUp && <div className="absolute top-1/2 -translate-y-1/2">
                <PopUp
                    title={dictionary.deletingYourAccount}
                    content={dictionary.deletingYourAccountText}
                    firstTextButton={dictionary.delete}
                    firstButton={handleDeleteAccount}
                    secondTextButton={dictionary.cancel}
                    secondButton={() => setDeletePopUp(false)}
                    type="delete"
                />
            </div>}
        </div>
    )
}