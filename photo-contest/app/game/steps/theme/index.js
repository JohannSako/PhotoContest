"use client";

import Text from "@/components/text";
import ThemeAnnouncement from "@/components/theme";
import { useEffect } from "react";
import anime from "animejs";

export default function GameTheme({ theme, category, handleLeaveTheme }) {
    useEffect(() => {
        const firstLoader = anime.timeline({
            complete: () => {}
        });
        firstLoader.add({
            targets: "#text",
            opacity: [0, 1],
            easing: 'easeInExpo',
            duration: 2000,
            delay: (el, i) => 30 * i,
        });
        firstLoader.add({
            targets: "#theme",
            opacity: [0, 1],
            easing: 'easeInExpo',
            duration: 2000,
            delay: (el, i) => 30 * i,
        });
    }, []);

    return (
        <div className="flex w-full h-[100vh] justify-center bg-primary flex-col" onClick={handleLeaveTheme}>
            <div id="text" className="flex flex-auto justify-center pt-[161px]">
                <Text color="white" size="22px" weight="700">TODAY THEME IS</Text>
            </div>
            <div id="theme" className="flex w-full items-end justify-center">
                <div className="animate-big-bounce">
                    <ThemeAnnouncement theme={theme.title} icon={category.icon} />
                </div>
            </div>
        </div>
    );
}