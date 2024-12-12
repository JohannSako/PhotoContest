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

export default function Settings() {
    const router = useRouter();
    const [deletePopUp, setDeletePopUp] = useState(false);
    const [loading, setLoading] = useState(false);

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
                title="Settings"
                left="Back"
                leftFunction={() => router.back()}
            />
            <div className="flex items-center gap-4 flex-col">
                <Button type="secondary" text="Logout" width="341px" onClick={handleLogout} />
                <Button type="delete" text="Delete account" width="341px" onClick={() => setDeletePopUp(true)} />
            </div>
            {deletePopUp && <div className="absolute top-1/2 -translate-y-1/2">
                <PopUp
                    title="Deleting your account"
                    content="Are you sure you want to delete your account? This action is permanent and cannot be undone. All your photos, points, and data will be permanently deleted, and you will lose access to any active games."
                    firstTextButton="Delete"
                    firstButton={handleDeleteAccount}
                    secondTextButton="Cancel"
                    secondButton={() => setDeletePopUp(false)}
                    type="delete"
                />
            </div>}
        </div>
    )
}