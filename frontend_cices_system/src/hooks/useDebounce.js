// hooks/useDebounce.js
import { useEffect, useState } from "react";

export function useDebounce(valor, delay = 300) {
    const [valorDebounced, setValorDebounced] = useState(valor);

    useEffect(() => {
        const handler = setTimeout(() => {
            setValorDebounced(valor);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [valor, delay]);

    return valorDebounced;
}