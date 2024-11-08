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
  };

  useEffect(() => {
    router.prefetch('/home');

    const timer = setTimeout(() => {
      finishLoading();
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {loading ? <SplashScreen finishLoading={finishLoading} /> : null}
    </div>
  );
}