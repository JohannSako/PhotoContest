"use client";

import Button from "@/components/input/button";
import Carousel from "@/components/photo/carousel";
import Text from "@/components/text";
import { useTranslation } from "@/context/TranslationContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OnBoard() {
    const router = useRouter();
    const { dictionary, locale } = useTranslation();
    const [platform, setPlatform] = useState('');
    const [index, setIndex] = useState(0);
    const iosImages = [
        `/assets/onboard/ios/safari.jpg`,
        `/assets/onboard/ios/share_${locale}.jpg`,
        `/assets/onboard/ios/addToHome_${locale}.jpg`,
        `/assets/onboard/ios/add_${locale}.jpg`,
        `/assets/onboard/ios/onHome.jpg`,
    ];
    const androidImages = [
        `/assets/onboard/android/chrome.jpg`,
        `/assets/onboard/android/dots_${locale}.jpg`,
        `/assets/onboard/android/addToHome_${locale}.jpg`,
        `/assets/onboard/android/install_${locale}.jpg`,
        `/assets/onboard/android/validInstall_${locale}.jpg`,
        `/assets/onboard/android/onHome.jpg`,
    ];

    const onClose = () => {
        localStorage.setItem('seenOnBoard', true);
        router.push('/home');
    }

    const isLastStep = () => {
        if (platform === 'ios')
            return (index === iosImages.length - 1)
        else
            return (index === androidImages.length - 1)
    }

    return (
        <div className="flex w-full h-screen flex-col bg-primary items-center p-4 justify-center gap-10 text-center">
            <Text color="#ffffff" size="20px" weight="700">
                {dictionary.installApp.toUpperCase()}
            </Text>
            {platform === '' && (
                <>
                    <div className="flex w-full justify-around">
                        <img
                            className="w-[30vw] h-[30vw] bg-slate-200 rounded-xl p-2 cursor-pointer"
                            src="/assets/onboard/ios/icon.png"
                            onClick={() => setPlatform('ios')}
                            alt="iOS Platform"
                        />
                        <img
                            className="w-[30vw] h-[30vw] bg-slate-200 rounded-xl p-2 cursor-pointer"
                            src="/assets/onboard/android/icon.png"
                            onClick={() => setPlatform('android')}
                            alt="Android Platform"
                        />
                    </div>
                    <Button
                        type="secondary"
                        text={dictionary.cancel}
                        onClick={onClose}
                    />
                </>
            )}
            {platform !== '' && (
                <div className="flex flex-col items-center w-full max-w-md">
                    <Carousel photos={platform === 'ios' ? iosImages : androidImages} setIndex={setIndex} onlyURL={true} />
                    <div className="h-16 flex items-center justify-center mt-4 px-4">
                        {isLastStep() ? (
                            <Button
                                text={dictionary[`${platform}_${index}`]}
                                type="secondary"
                                onClick={onClose}
                            />
                        ) : (
                            <Text color="white" className="text-center break-words">
                                {dictionary[`${platform}_${index}`]}
                            </Text>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
