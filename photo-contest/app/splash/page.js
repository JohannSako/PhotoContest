"use client";

import IconSlogan from "@/components/icon/slogan";
import anime from "animejs";
import { useEffect } from "react";

export default function SplashScreen({ finishLoading }) {
  useEffect(() => {
    const loader = anime.timeline({
      complete: () => finishLoading()
    });
    loader.add({
      targets: "#logo",
      delay: 0,
      scale: 1.2,
      duration: 3000,
      easing: "easeInOutExpo",
    });
  }, []);

  return (
    <div className="flex w-full h-[100vh] items-center justify-center bg-primary">
      <IconSlogan id="logo" />
    </div>
  );
}