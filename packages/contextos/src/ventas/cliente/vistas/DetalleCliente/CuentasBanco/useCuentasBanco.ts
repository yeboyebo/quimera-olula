import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento, EventoMaquina } from "@olula/lib/diseño.ts";
import { procesarEvento } from "@olula/lib/dominio.js";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ContextoCuentasBanco } from "./diseño.ts";
import { getMaquina } from "./maquina.ts";

interface UseCuentasBancoOptions {
    clienteId: string;
    publicar?: EmitirEvento;
}

export const useCuentasBanco = (options: UseCuentasBancoOptions) => {
    const { clienteId, publicar } = options;
    const { intentar } = useContext(ContextoError);
    const maquina = getMaquina();

    const [ctx, setCtx] = useState<ContextoCuentasBanco>({
        estado: "lista",
        cuentas: [],
        cuentaActiva: null,
        cargando: true,
        clienteId,
    });

    const ctxRef = useRef<ContextoCuentasBanco>(ctx);
    const clienteIdRef = useRef<string | null>(null);

    useEffect(() => {
        ctxRef.current = ctx;
    }, [ctx]);

    const emitir = useCallback(
        async (evento: string, payload?: unknown, inicial: boolean = false): Promise<EventoMaquina[]> => {
            const contexto: ContextoCuentasBanco = {
                ...ctxRef.current,
                estado: inicial ? "lista" : ctxRef.current.estado,
                clienteId,
            };

            const [nuevoContexto, eventos] = await intentar(() =>
                procesarEvento(maquina, contexto, evento, payload)
            );

            setCtx(nuevoContexto);

            if (publicar) {
                eventos.forEach(([nombre, datos]) => publicar(nombre, datos));
            }

            return eventos;
        },
        [maquina, intentar, publicar, clienteId]
    );

    useEffect(() => {
        console.log("useCuentasBanco - useEffect clienteId", clienteId, clienteIdRef.current);
        if (clienteId && clienteId !== clienteIdRef.current) {
            console.log("useCuentasBanco - emitir cargar_cuentas");
            clienteIdRef.current = clienteId;
            emitir("cargar_cuentas", clienteId, true);
        }
    }, [clienteId, emitir]);

    return { ctx, emitir, estado: ctx.estado };
};
