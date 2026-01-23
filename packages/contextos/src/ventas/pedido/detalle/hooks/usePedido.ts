import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento, EventoMaquina } from "@olula/lib/diseño.ts";
import { procesarEvento } from "@olula/lib/dominio.js";
import { useModelo } from "@olula/lib/useModelo.js";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { LineaPedido, Pedido } from "../../diseño.ts";
import { ContextoPedido, EstadoPedido } from "../diseño.ts";
import { metaPedido, pedidoVacio } from "../dominio.ts";
import { getMaquina } from "../maquina.ts";

interface UsePedidoOptions {
    pedidoId?: string;
    pedidoInicial?: Pedido | null;
    publicar?: EmitirEvento;
}

export const usePedido = (options: UsePedidoOptions = {}) => {
    const { pedidoId, pedidoInicial, publicar } = options;
    const { intentar } = useContext(ContextoError);
    const maquina = getMaquina();

    const modelo = useModelo(
        metaPedido,
        pedidoInicial || pedidoVacio()
    );

    const [estado, setEstado] = useState<EstadoPedido>("INICIAL");
    const [lineaActiva, setLineaActiva] = useState<LineaPedido | null>(null);
    const pedidoIdCargadoRef = useRef<string | null>(null);

    const emitir = useCallback(
        async (evento: string, payload?: unknown, inicial: boolean = false): Promise<EventoMaquina[]> => {
            const contexto: ContextoPedido = {
                estado: inicial ? 'INICIAL' : estado,
                pedido: modelo.modelo,
                pedidoInicial: modelo.modeloInicial,
                lineaActiva,
            };

            const [nuevoContexto, eventos] = await intentar(() =>
                procesarEvento(maquina, contexto, evento, payload)
            );

            setEstado(nuevoContexto.estado);
            setLineaActiva(nuevoContexto.lineaActiva);

            if (nuevoContexto.pedido !== modelo.modelo) {
                modelo.init(nuevoContexto.pedido);
            }

            if (publicar) {
                eventos.forEach(([nombre, datos]) => publicar(nombre, datos));
            }

            return eventos;
        },
        [estado, lineaActiva, modelo, intentar, publicar, maquina]
    );

    useEffect(() => {
        if (pedidoId && pedidoId !== pedidoIdCargadoRef.current) {
            pedidoIdCargadoRef.current = pedidoId;
            emitir("pedido_id_cambiado", pedidoId, true);
        }
    }, [pedidoId, emitir]);

    return {
        ...modelo,
        estado,
        lineaActiva,
        emitir,
    };
};
