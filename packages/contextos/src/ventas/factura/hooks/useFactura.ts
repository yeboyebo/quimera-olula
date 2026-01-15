import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento, EventoMaquina } from "@olula/lib/diseño.ts";
import { procesarEvento } from "@olula/lib/dominio.js";
import { useModelo } from "@olula/lib/useModelo.js";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ContextoFactura, EstadoFactura, Factura } from "../diseño.ts";
import { facturaVacia, metaFactura } from "../dominio.ts";
import { getMaquina } from "../maquina.ts";

interface UseFacturaOptions {
    facturaId?: string;
    facturaInicial?: Factura | null;
    publicar?: EmitirEvento;
}

export const useFactura = (options: UseFacturaOptions = {}) => {
    const { facturaId, facturaInicial, publicar } = options;
    const { intentar } = useContext(ContextoError);
    const maquina = getMaquina();

    const modelo = useModelo(
        metaFactura,
        facturaInicial || facturaVacia()
    );

    const [estado, setEstado] = useState<EstadoFactura>("INICIAL");
    const facturaIdCargadoRef = useRef<string | null>(null);

    const emitir = useCallback(
        async (evento: string, payload?: unknown, inicial: boolean = false): Promise<EventoMaquina[]> => {
            const contexto: ContextoFactura = {
                estado: inicial ? 'INICIAL' : estado,
                factura: modelo.modelo,
                facturaInicial: modelo.modeloInicial,
            };

            const [nuevoContexto, eventos] = await intentar(() =>
                procesarEvento(maquina, contexto, evento, payload)
            );

            setEstado(nuevoContexto.estado);

            if (nuevoContexto.factura !== modelo.modelo) {
                modelo.init(nuevoContexto.factura);
            }

            if (publicar) {
                eventos.forEach(([nombre, datos]) => publicar(nombre, datos));
            }

            return eventos;
        },
        [estado, modelo, intentar, publicar, maquina]
    );

    useEffect(() => {
        if (facturaId && facturaId !== facturaIdCargadoRef.current) {
            facturaIdCargadoRef.current = facturaId;
            emitir("factura_id_cambiado", facturaId, true);
        }
    }, [facturaId, emitir]);

    return {
        ...modelo,
        estado,
        emitir,
    };
};
