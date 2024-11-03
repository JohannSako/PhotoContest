import React from 'react';
import "../../../../app/globals.css";
import Text from '@/components/text';
import Button from '@/components/input/button';

export default function TimeSetDefault({ text = 'Set Time', defaultValue = '00:00', onClick }) {
    return (
        <div className="w-[366px] h-[55px] flex flex-col flex-shrink-0 gap-3">
            <div className="flex flex-row items-center justify-between w-full">
                <Text weight='600'>{defaultValue}</Text>
                <Button text={text} type="secondary" height={40} width={100} onClick={onClick} />
            </div>
            <div className="w-full h-[1px] bg-gray-8" />
        </div>
    );
}
