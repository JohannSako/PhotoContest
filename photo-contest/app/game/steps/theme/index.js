"use client";

import Text from "@/components/text";
import ThemeAnnouncement from "@/components/theme";
import { useEffect } from "react";
import anime from "animejs";
import { useTranslation } from "@/context/TranslationContext";
import toast from "react-hot-toast";

export default function GameTheme({ theme, category, handleLeaveTheme }) {
    const { dictionary, locale } = useTranslation();

    useEffect(() => {
        const firstLoader = anime.timeline({
            complete: () => { }
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
        setTimeout(handleLeaveTheme, 8000);
    }, []);

    return (
        <div className="flex w-full h-[100vh] justify-center bg-primary flex-col" onClick={handleLeaveTheme}>
            <div id="text" className="flex flex-auto justify-center pt-[161px]">
                <Text color="white" size="22px" weight="700">{dictionary.todayTheme}</Text>
            </div>
            <div id="theme" className="flex w-full items-end justify-center">
                <div className="animate-big-bounce">
                    <ThemeAnnouncement theme={locale === 'fr' ? dictionary[theme.title] : theme.title} icon={category.icon} />
                </div>
            </div>
        </div>
    );
}