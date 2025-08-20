import { useCallback, useRef, useState } from "react";

type OnEvento<E> = (payload?: unknown) => E | void | Promise<E | void>

export type Maquina<E extends string> = Record<E, Record<string, E | OnEvento<E>>>;

type ProcesarEvento = (evento: string, payload?: unknown) => void;
export function useMaquina<Estado extends string>(
    maquina: Maquina<Estado>,
    estado: Estado,
    setEstado: (estado: Estado) => void
): ProcesarEvento {
    return useCallback(async (evento, payload) => {
        // console.log("procesarEvento", evento, payload, 'estado actual', estado);
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


export function useMaquina2<Estado extends string>(
    maquina: Maquina<Estado>,
    estadoInicial: Estado,
): [ProcesarEvento, Estado, (estado: Estado) => void] {

    const [estado, setEstado] = useState<Estado>(estadoInicial);
    const estadoPrevio = useRef<Estado>(estadoInicial);

    if (estado !== estadoPrevio.current) {
        estadoPrevio.current = estado;
        if ('al_entrar' in maquina[estado]) {
            const onEnter = maquina[estado].al_entrar;
            if (typeof onEnter === 'function') {
                onEnter();
            }
        }
    }

    const emitir: ProcesarEvento = useCallback(async (evento, payload) => {
        // console.log("Evento recibido:", evento, "en estado actual:", estado);
        if (!(evento in maquina[estado])) {
            return;
        }
        const proceso = maquina[estado][evento];
        const nuevoEstado = proceso ?
            typeof proceso === 'string'
                ? proceso
                : await proceso(payload) : undefined;
        setEstado(nuevoEstado || estado);

    }, [maquina, estadoInicial, estado]);

    return [emitir, estado, setEstado];
}