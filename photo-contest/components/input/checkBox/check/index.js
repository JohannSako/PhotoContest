import Text from "@/components/text";
import { useState } from "react";
import Image from "next/image";
import CheckIcon from "../../../../public/assets/icons/Checkmark.svg";

export default function CheckBox({ state }) {
    if (state) {
        return (
            <div className="flex w-5 h-5 flex-shrink-0 rounded border bg-green-primary border-green-secondary justify-center">
                <Image src={CheckIcon} alt='check-icon'/>
            </div>
        )
    }
    else {
        return (
            <div className="w-5 h-5 flex-shrink-0 rounded border bg-check-empty border-gray-8" />
        )
    }
}