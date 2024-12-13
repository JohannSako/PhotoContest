'use client';

import { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function ServiceWorkerRegistration() {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registered with scope:'+ registration.scope);
                })
                .catch(error => {
                    toast.error('Service Worker registration failed.');
                });
        } else {
            toast.error('Service Workers are not supported in your browser.');
        }
    }, []);

    return null;
}