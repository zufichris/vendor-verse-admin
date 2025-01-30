import { useState, useEffect } from "react";

export function useDebounce<T>(input: T, delay: number): T {
    const [value, setValue] = useState<T>(input);

    useEffect(() => {
        const handler = setTimeout(() => {
            setValue(input);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [input, delay]);

    return value;
}
