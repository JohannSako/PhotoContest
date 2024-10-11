import Text from "@/components/text";
import { useState } from "react";
import CheckBox from "./check";

export default function CheckBoxText({ text = "Text here", state = false, setState }) {
    const [localState, setLocalState] = useState(state);

    const switchCheckBoxState = () => {
        setLocalState(!localState);
        setState(!localState);
    }

    return (
        <div className="flex flex-row gap-2 justify-center items-center text-center" onClick={switchCheckBoxState}>
            <CheckBox state={localState} />
            <Text size="13px" weight={localState ? "600" : "400"} color={localState ? "#4B9460" : "#666666"}>{text}</Text>
        </div>
    );
}