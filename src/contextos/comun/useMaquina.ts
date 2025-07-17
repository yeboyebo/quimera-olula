import { useCallback } from "react";

type OnEvento<E> = (payload?: unknown) => E | void | Promise<E | void>

export type Maquina<E extends string> = Record<E, Record<string, E | OnEvento<E>>>;

type ProcesarEvento = (evento: string, payload?: unknown) => void;
export function useMaquina<Estado extends string>(
    maquina: Maquina<Estado>,
    estado: Estado,
    setEstado: (estado: Estado) => void
): ProcesarEvento {
    return useCallback(async (evento, payload) => {
        console.log("useMaquina_procesarEvento", evento, payload, ', estado actual:', estado);
        if (!(evento in maquina[estado])) {
            return;
        }
        const proceso = maquina[estado][evento];
        const nuevoEstado = proceso ?
            typeof proceso === 'string'
                ? proceso
                : await proceso(payload) : undefined;
        setEstado(nuevoEstado || estado);
    }, [maquina, estado, setEstado]);
}