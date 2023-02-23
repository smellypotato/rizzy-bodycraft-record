import { useCallback, useState } from "react";

export const useInput = (initialValue: string): [React.ChangeEventHandler<HTMLInputElement>, typeof initialValue, React.Dispatch<typeof initialValue>] => {
    const [value, setValue] = useState(initialValue);
    // const [error, setError] = useState<string | undefined>();
    const onInput: React.ChangeEventHandler<HTMLInputElement> = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.currentTarget.value);
    }, []);
    
    return [onInput, value, setValue];
}
