import { useCallback, useState } from "react";
import Firebase from "../firebase";

export const useAddPanel = (): [string, React.Dispatch<React.SetStateAction<string>>, (set: React.Dispatch<string>, e: React.ChangeEvent<HTMLInputElement>) => void, (categoryId: string, label: string, choices?: Array<string>) => void] => {
    const [label, setLabel] = useState("");

    const onInput = useCallback((set: React.Dispatch<string>, e: React.ChangeEvent<HTMLInputElement>) => {
        set(e.currentTarget.value);
    }, []);

    const addOption = useCallback((categoryId: string, label: string, choices?: Array<string>) => {
        Firebase.instance.addOption(categoryId, label, choices);
    }, []);

    return [label, setLabel, onInput, addOption];
}
