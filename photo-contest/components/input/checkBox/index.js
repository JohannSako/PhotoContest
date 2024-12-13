import Text from "@/components/text";
import CheckBox from "./check";

export default function CheckBoxText({ text = "Text here", state = false, setState }) {
    const switchCheckBoxState = () => {
        setState(!state);
    }

    return (
        <div className="flex flex-row gap-2 justify-center items-center text-center" onClick={switchCheckBoxState}>
            <CheckBox state={state} />
            <Text size="13px" weight={state ? "600" : "400"} color={state ? "#4B9460" : "#666666"}>
                {text}
            </Text>
        </div>
    );
}