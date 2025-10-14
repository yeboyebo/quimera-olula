import { useEffect, useState } from "react";

export function useEsMovil(anchoMaximo = 768) {
    const [esMovil, setEsMovil] = useState(
        () => window.matchMedia(`(max-width: ${anchoMaximo}px)`).matches
    );

    useEffect(() => {
        const media = window.matchMedia(`(max-width: ${anchoMaximo}px)`);
        const listener = (e: MediaQueryListEvent) => setEsMovil(e.matches);
        media.addEventListener("change", listener);
        return () => media.removeEventListener("change", listener);
    }, [anchoMaximo]);

    return esMovil;
}
