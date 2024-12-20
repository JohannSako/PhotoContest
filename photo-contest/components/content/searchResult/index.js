import Image from 'next/image';
import Text from '../../text';
import BinIcon from "../../../public/assets/icons/Bin.svg";
import CalendarIcon from "../../../public/assets/icons/Calendar.svg";

export default function SearchResult({ result, calendar = undefined, bin = undefined, handleResult = undefined, profilePicture = undefined }) {
    return (
        <div className="flex w-[343px] h-11 flex-shrink-0 flex-col gap-2">
            <div className="flex flex-shrink-0 flex-row justify-between">
                {profilePicture && (
                    <div className="flex w-[15%]">
                        <Image src={profilePicture} alt="Profile Picture" className="flex w-8 h-8 rounded-full border-[0.2px] border-black" width={32} height={32} />
                    </div>
                )}
                <div className="flex w-[90%] active:opacity-50 items-center" onClick={handleResult}>
                    <Text weight="500">{result}</Text>
                </div>
                <div className='flex flex-row gap-[17px] items-center'>
                    {calendar && (
                        <Image src={CalendarIcon} alt="Calendar icon" className={calendar ? "active:opacity-50" : ""} onClick={calendar} />
                    )}
                    {bin && (
                        <Image src={BinIcon} alt="Bin icon" className={bin ? "active:opacity-50" : ""} onClick={bin} />
                    )}
                </div>
            </div>
            <div className="w-full h-[1px] bg-gray-8" />
        </div>
    );
};