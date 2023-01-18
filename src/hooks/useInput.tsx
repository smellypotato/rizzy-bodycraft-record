import { useState } from "react";

export const useInput = (initialValue: string): [typeof initialValue, React.Dispatch<typeof initialValue>] => {
    const [value, setValue] = useState(initialValue);
    // const [error, setError] = useState<string | undefined>();

    return [value, setValue];
}
