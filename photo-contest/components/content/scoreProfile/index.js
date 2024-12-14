import Image from 'next/image';
import Text from '@/components/text';
import BinIcon from "../../../public/assets/icons/Bin.svg";

export default function ScoreProfile({ name, picture, score, bin = undefined }) {
    return (
        <div className="flex w-[343px] h-11 flex-shrink-0 flex-col gap-2">
            <div className="flex flex-shrink-0 flex-row justify-between items-center">
                <div className="flex flex-row gap-[17px] items-center">
                    <div className="w-8 h-8 relative">
                        <Image
                            src={picture}
                            layout="fill"
                            className="rounded-full border-[0.2px]"
                            alt={`${name}'s profile picture`}
                        />
                    </div>
                    <Text weight="600">{name}</Text>
                </div>
                <Text>Score: {score}</Text>
            </div>
            <div className="w-full h-[1px] bg-gray-8" />
        </div>
    );
}
