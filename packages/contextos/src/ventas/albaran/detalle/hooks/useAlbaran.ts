import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento, EventoMaquina } from "@olula/lib/diseño.ts";
import { procesarEvento } from "@olula/lib/dominio.js";
import { useModelo } from "@olula/lib/useModelo.js";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Albaran, LineaAlbaran } from "../../diseño.ts";
import { albaranVacio, metaAlbaran } from "../../dominio.ts";
import { ContextoAlbaran, EstadoAlbaran } from "../diseño.ts";
import { getMaquina } from "../maquina.ts";

interface UseAlbaranOptions {
    albaranId?: string;
    albaranInicial?: Albaran | null;
    publicar?: EmitirEvento;
}

export const useAlbaran = (options: UseAlbaranOptions = {}) => {
    const { albaranId, albaranInicial, publicar } = options;
    const { intentar } = useContext(ContextoError);
    const maquina = getMaquina();

    const modelo = useModelo(
        metaAlbaran,
        albaranInicial || albaranVacio()
    );

    const [estado, setEstado] = useState<EstadoAlbaran>("INICIAL");
    const [lineaActiva, setLineaActiva] = useState<LineaAlbaran | null>(null);
    const albaranIdCargadoRef = useRef<string | null>(null);

    const emitir = useCallback(
        async (evento: string, payload?: unknown, inicial: boolean = false): Promise<EventoMaquina[]> => {
            const contexto: ContextoAlbaran = {
                estado: inicial ? 'INICIAL' : estado,
                albaran: modelo.modelo,
                albaranInicial: modelo.modeloInicial,
                lineaActiva,
            };

            const [nuevoContexto, eventos] = await intentar(() =>
                procesarEvento(maquina, contexto, evento, payload)
            );

            setEstado(nuevoContexto.estado);
            setLineaActiva(nuevoContexto.lineaActiva);

            if (nuevoContexto.albaran !== modelo.modelo) {
                modelo.init(nuevoContexto.albaran);
            }

            if (publicar) {
                eventos.forEach(([nombre, datos]) => publicar(nombre, datos));
            }

            return eventos;
        },
        [estado, lineaActiva, modelo, intentar, publicar, maquina]
    );

    useEffect(() => {
        if (albaranId && albaranId !== albaranIdCargadoRef.current) {
            albaranIdCargadoRef.current = albaranId;
            emitir("albaran_id_cambiado", albaranId, true);
        }
    }, [albaranId, emitir]);

    return {
        ...modelo,
        estado,
        lineaActiva,
        emitir,
    };
};
