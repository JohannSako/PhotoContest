import React from 'react';
import "../../../../app/globals.css";
import Text from '@/components/text';
import Button from '@/components/input/button';
import CheckBoxText from '@/components/input/checkBox';

export default function TimeSetCheck({ buttonText = 'Set Time', checkBoxText = 'When all players voted', timeValue = '00:00', onClick, state = false, setState }) {
    return (
        <div className="w-[366px] h-[55px] flex flex-col flex-shrink-0 gap-3">
            <div className="flex flex-row items-center justify-between w-full gap-[10px]">
                <div className="flex flex-row items-center justify-between w-1/2">
                    <Text weight='600' color={state ? '#BDBDBD' : '#000000'}>{timeValue}</Text>
                    <Button text={buttonText} type={state ? "disabled" : "secondary"} height={40} width={100} onClick={onClick} />
                </div>
                <div className="w-1/2">
                    <CheckBoxText text={checkBoxText} setState={setState} state={state} />
                </div>
            </div>
            <div className="w-full h-[1px] bg-gray-8" />
        </div>
    );
}