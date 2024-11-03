"use client";

import { useEffect, useState } from 'react';
import "../../../app/globals.css";

export default function MainLayout({ children }) {
  const [isPhoneScreen, setIsPhoneScreen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsPhoneScreen(window.innerWidth <= 768);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isPhoneScreen) {
    return (
      <div className="flex justify-center items-center h-screen text-center text-xl font-medium">
        <p>This application is designed to be used on a phone-type screen. Please resize your browser or switch to a mobile device to use the app.</p>
      </div>
    );
  }

  return (
    <section>
      {/* Include shared UI here e.g. a header or sidebar */}
      <nav></nav>
      {children}
    </section>
  );
}