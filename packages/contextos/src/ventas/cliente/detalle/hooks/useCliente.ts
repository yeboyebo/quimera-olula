import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento, EventoMaquina } from "@olula/lib/diseño.ts";
import { procesarEvento } from "@olula/lib/dominio.js";
import { useModelo } from "@olula/lib/useModelo.js";
import { useCallback, useContext, useEffect, useState } from "react";
import { Cliente } from "../../diseño.ts";
import { ContextoCliente, EstadoCliente } from "../diseño.ts";
import { clienteVacio, metaCliente } from "../dominio.ts";
import { getMaquina } from "../maquina.ts";

interface UseClienteOptions {
    clienteId?: string;
    clienteInicial?: Cliente | null;
    publicar?: EmitirEvento;
}

export const useCliente = (options: UseClienteOptions = {}) => {
    const { clienteId, clienteInicial, publicar } = options;
    const { intentar } = useContext(ContextoError);
    const maquina = getMaquina();

    const [idClienteAnterior, setIdClienteAnterior] = useState<string | null>(null);

    const modelo = useModelo(
        metaCliente,
        clienteInicial || clienteVacio()
    );

    const [estado, setEstado] = useState<EstadoCliente>("INICIAL");

    const emitir = useCallback(
        async (evento: string, payload?: unknown, inicial: boolean = false): Promise<EventoMaquina[]> => {
            const contexto: ContextoCliente = {
                estado: inicial ? 'INICIAL' : estado,
                cliente: modelo.modelo,
                clienteInicial: modelo.modeloInicial,
            };

            const [nuevoContexto, eventos] = await intentar(() =>
                procesarEvento(maquina, contexto, evento, payload)
            );
            setEstado(nuevoContexto.estado);

            if (nuevoContexto.cliente !== modelo.modelo) {
                modelo.init(nuevoContexto.cliente);
            }

            if (publicar) {
                eventos.forEach(([nombre, datos]) => publicar(nombre, datos));
            }

            return eventos;
        },
        [estado, modelo, intentar, publicar, maquina]
    );

    useEffect(() => {
        if (clienteId && clienteId !== idClienteAnterior) {
            setIdClienteAnterior(clienteId);
            emitir("cliente_id_cambiado", clienteId, true);
        }
    }, [clienteId, emitir, idClienteAnterior]);

    return {
        ...modelo,
        estado,
        emitir,
    };
};
