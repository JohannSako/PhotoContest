import React from 'react';
import "../../../../app/globals.css";
import Text from '@/components/text';
import Button from '@/components/input/button';

export default function TimeSetDuo({ firstText = 'Set Time', secondText = 'Set Time', firstValue = '00:00', secondValue = '00:00', firstOnClick, secondOnClick }) {
    return (
        <div className="w-[366px] h-[55px] flex flex-col flex-shrink-0 gap-3">
            <div className="flex flex-row items-center justify-between w-full gap-[10px]">
                <div className="flex flex-row items-center justify-between w-1/2">
                    <Text weight='600'>{firstValue}</Text>
                    <Button text={firstText} type="secondary" height={40} width={100} onClick={firstOnClick} />
                </div>
                <div className="flex flex-row items-center justify-between w-1/2">
                    <Text weight='600'>{secondValue}</Text>
                    <Button text={secondText} type="secondary" height={40} width={100} onClick={secondOnClick} />
                </div>
            </div>
            <div className="w-full h-[1px] bg-gray-8" />
        </div>
    );
}
