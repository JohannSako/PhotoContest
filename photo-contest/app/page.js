"use client";

import { useState, useEffect } from "react";
import SplashScreen from "./splash/page";
import { useRouter } from 'next/navigation';
import Cookies from "js-cookie";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const finishLoading = () => {
    setLoading(false);
    const token = Cookies.get('token');
    router.push('/home');
  };

  useEffect(() => {
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