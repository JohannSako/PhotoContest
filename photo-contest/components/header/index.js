import Text from "../text";

export default function Header({ title = 'Header', left = undefined, right = undefined, leftFunction = undefined, rightFunction = undefined, mainColor = '#000000', buttonColor = '#5DB075' }) {
    return (
        <div class="relative flex w-full items-center text-center flex-shrink-0">
            <div class="absolute left-8 text-end">
                {left && <div class="active:opacity-50" onClick={leftFunction}>
                    <Text weight="500" color={buttonColor}>{left}</Text>
                </div>}
            </div>
            <div class="flex-grow">
                <Text size="30px" weight="600" color={mainColor}>{title}</Text>
            </div>
            <div class="absolute right-8 text-start">
                {right && <div class="active:opacity-50" onClick={rightFunction}>
                    <Text weight="500" color={buttonColor}>{right}</Text>
                </div>}
            </div>
        </div>
    );
};