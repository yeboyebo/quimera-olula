import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento, EventoMaquina } from "@olula/lib/diseño.ts";
import { procesarEvento } from "@olula/lib/dominio.js";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ContextoCrmContactos } from "./diseño.ts";
import { getMaquina } from "./maquina.ts";

interface UseCrmContactosOptions {
    clienteId: string;
    publicar?: EmitirEvento;
}

export const useCrmContactos = (options: UseCrmContactosOptions) => {
    const { clienteId, publicar } = options;
    const { intentar } = useContext(ContextoError);
    const maquina = getMaquina();

    const [ctx, setCtx] = useState<ContextoCrmContactos>({
        estado: "lista",
        contactos: [],
        contactoActivo: null,
        cargando: true,
        clienteId,
    });

    const ctxRef = useRef<ContextoCrmContactos>(ctx);
    const clienteIdRef = useRef<string | null>(null);

    useEffect(() => {
        ctxRef.current = ctx;
    }, [ctx]);

    const emitir = useCallback(
        async (evento: string, payload?: unknown, inicial: boolean = false): Promise<EventoMaquina[]> => {
            const contexto: ContextoCrmContactos = {
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
        if (clienteId && clienteId !== clienteIdRef.current) {
            clienteIdRef.current = clienteId;
            emitir("cargar_contactos", clienteId, true);
        }
    }, [clienteId, emitir]);

    return { ctx, emitir, estado: ctx.estado };
};
