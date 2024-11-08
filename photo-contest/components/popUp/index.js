import Button from "../input/button";
import Text from "../text";

export default function PopUp({title, content, firstTextButton, firstButton, secondTextButton, secondButton, type = 'primary'}) {
    return (
        <div className="w-[343px] flex flex-col flex-shrink-0 bg-white rounded-lg text-center gap-[45px] py-8" style={{boxShadow: "0px 2px 20px rgba(38, 36, 131, 0.25)"}}>
            <div className="flex gap-4 flex-col px-2">
                <Text size="30px" weight="600">{title}</Text>
                <Text weight="500" color="#666">{content}</Text>
            </div>
            <div className="flex flex-col gap-[18px] items-center">
                <Button type={type} text={firstTextButton} onClick={firstButton} width="311px"/>
                <div className="active:opacity-50" onClick={secondButton}>
                    <Text weight="600" color="#5DB075">{secondTextButton}</Text>
                </div>
            </div>
        </div>
    );
};
