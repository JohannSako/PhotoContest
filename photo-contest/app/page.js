"use client";

import { useState, useEffect } from "react";
import SplashScreen from "./splash/page";
import { useRouter } from 'next/navigation';
import Cookies from "js-cookie";
import toast from "react-hot-toast";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const finishLoading = () => {
    setLoading(false);
    const seenOnboard = localStorage.getItem('seenOnBoard');

    console.log("test");
    router.push(seenOnboard ? '/home' : '/onboard');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      finishLoading();
    }, 4000);

    return () => clearTimeout(timer);
  });

  return (
    <div>
      {loading ? <SplashScreen finishLoading={finishLoading} /> : null}
    </div>
  );
}