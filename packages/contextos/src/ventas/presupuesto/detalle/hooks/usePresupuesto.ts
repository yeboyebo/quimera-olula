import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento, EventoMaquina } from "@olula/lib/diseño.ts";
import { procesarEvento } from "@olula/lib/dominio.js";
import { useModelo } from "@olula/lib/useModelo.js";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { LineaPresupuesto, Presupuesto } from "../../diseño.ts";
import { ContextoPresupuesto, EstadoPresupuesto } from "../diseño.ts";
import { metaPresupuesto, presupuestoVacio } from "../dominio.ts";
import { getMaquina } from "../maquina.ts";

interface UsePresupuestoOptions {
    presupuestoId?: string;
    presupuestoInicial?: Presupuesto | null;
    publicar?: EmitirEvento;
}

export const usePresupuesto = (options: UsePresupuestoOptions = {}) => {
    const { presupuestoId, presupuestoInicial, publicar } = options;
    const { intentar } = useContext(ContextoError);
    const maquina = getMaquina();

    const modelo = useModelo(
        metaPresupuesto,
        presupuestoInicial || presupuestoVacio()
    );

    const [estado, setEstado] = useState<EstadoPresupuesto>("INICIAL");
    const [lineaActiva, setLineaActiva] = useState<LineaPresupuesto | null>(null);
    const presupuestoIdCargadoRef = useRef<string | null>(null);

    const emitir = useCallback(
        async (evento: string, payload?: unknown, inicial: boolean = false): Promise<EventoMaquina[]> => {
            const contexto: ContextoPresupuesto = {
                estado: inicial ? 'INICIAL' : estado,
                presupuesto: modelo.modelo,
                presupuestoInicial: modelo.modeloInicial,
                lineaActiva,
            };

            const [nuevoContexto, eventos] = await intentar(() =>
                procesarEvento(maquina, contexto, evento, payload)
            );

            setEstado(nuevoContexto.estado);
            setLineaActiva(nuevoContexto.lineaActiva);

            if (nuevoContexto.presupuesto !== modelo.modelo) {
                modelo.init(nuevoContexto.presupuesto);
            }

            if (publicar) {
                eventos.forEach(([nombre, datos]) => publicar(nombre, datos));
            }

            return eventos;
        },
        [estado, lineaActiva, modelo, intentar, publicar, maquina]
    );

    useEffect(() => {
        if (presupuestoId && presupuestoId !== presupuestoIdCargadoRef.current) {
            presupuestoIdCargadoRef.current = presupuestoId;
            emitir("presupuesto_id_cambiado", presupuestoId, true);
        }
    }, [presupuestoId, emitir]);

    return {
        ...modelo,
        estado,
        lineaActiva,
        emitir,
    };
};

