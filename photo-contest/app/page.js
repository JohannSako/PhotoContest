// pages/index.js
"use client";

import { useState, useEffect } from "react";
import SplashScreen from "./splash/page";
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const finishLoading = () => {
    setLoading(false);
    router.push('/home');
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      finishLoading();
    }, 3000); // minimum time for splash screen (3 seconds)

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {loading ? <SplashScreen finishLoading={finishLoading} /> : null}
    </div>
  );
}