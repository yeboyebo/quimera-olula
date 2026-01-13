import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento, EventoMaquina } from "@olula/lib/diseño.ts";
import { procesarEvento } from "@olula/lib/dominio.js";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { getMaquina } from "./maquina.ts";
import { ContextoDirecciones } from "./tipos.ts";

interface UseDireccionesOptions {
    clienteId: string;
    publicar?: EmitirEvento;
}

export const useDirecciones = (options: UseDireccionesOptions) => {
    const { clienteId, publicar } = options;
    const { intentar } = useContext(ContextoError);
    const maquina = getMaquina();

    const [ctx, setCtx] = useState<ContextoDirecciones>({
        estado: "lista",
        direcciones: [],
        direccionActiva: null,
        cargando: true,
        clienteId,
    });

    const clienteIdRef = useRef<string | null>(null);

    const emitir = useCallback(
        async (evento: string, payload?: unknown, inicial: boolean = false): Promise<EventoMaquina[]> => {
            const contexto: ContextoDirecciones = {
                ...ctx,
                estado: inicial ? "lista" : ctx.estado,
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
        [ctx, maquina, intentar, publicar, clienteId]
    );

    useEffect(() => {
        if (clienteId && clienteId !== clienteIdRef.current) {
            clienteIdRef.current = clienteId;
            emitir("cargar_direcciones", clienteId, true);
        }
    }, [clienteId, emitir]);

    return { ctx, emitir, estado: ctx.estado };
};
