import Button from "../input/button";
import Text from "../text";

export default function PopUp({title, content, firstTextButton, firstButton, secondTextButton, secondButton}) {
    return (
        <div class="w-[343px] flex flex-col flex-shrink-0 bg-white rounded-lg text-center gap-[45px] py-8" style={{boxShadow: "0px 2px 20px rgba(38, 36, 131, 0.25)"}}>
            <div class="flex gap-4 flex-col px-4">
                <Text size="30px" weight="600">{title}</Text>
                <Text weight="500" color="#666">{content}</Text>
            </div>
            <div class="flex flex-col gap-[18px] items-center">
                <Button text={firstTextButton} onClick={firstButton} width="311px"/>
                <div class="active:opacity-50" onClick={secondButton}>
                    <Text weight="600" color="#5DB075">{secondTextButton}</Text>
                </div>
            </div>
        </div>
    );
};
