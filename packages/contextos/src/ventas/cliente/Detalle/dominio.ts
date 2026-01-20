// Dominio de detalle
import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { ejecutarListaProcesos, publicar } from "@olula/lib/dominio.js";
import { Cliente, ContextoCliente, EstadoCliente } from "../diseño.ts";
import { clienteVacio } from "../dominio.ts";
import {
    darDeAltaCliente,
    darDeBajaCliente,
    deleteCliente,
    getCliente,
    patchCliente,
} from "../infraestructura.ts";

type ProcesarCliente = ProcesarContexto<EstadoCliente, ContextoCliente>;

const pipeCliente = ejecutarListaProcesos<EstadoCliente, ContextoCliente>;

const clienteVacioObjeto: Cliente = clienteVacio();

export const clienteVacioContexto = (): Cliente => ({ ...clienteVacioObjeto });

const cargarCliente: (_: string) => ProcesarCliente = (idCliente) =>
    async (contexto) => {
        const cliente = await getCliente(idCliente);
        return {
            ...contexto,
            cliente,
            clienteInicial: cliente,
        }
    }

export const refrescarCliente: ProcesarCliente = async (contexto) => {
    const cliente = await getCliente(contexto.cliente.id);
    return [
        {
            ...contexto,
            cliente: {
                ...contexto.cliente,
                ...cliente
            },
        },
        [["cliente_cambiado", cliente]]
    ]
}

export const cancelarCambioCliente: ProcesarCliente = async (contexto) => {
    return {
        ...contexto,
        cliente: contexto.clienteInicial
    }
}

export const abiertoContexto: ProcesarCliente = async (contexto) => {
    return {
        ...contexto,
        estado: "ABIERTO"
    }
}

export const getContextoVacio: ProcesarCliente = async (contexto) => {
    return {
        ...contexto,
        estado: 'INICIAL',
        cliente: clienteVacioContexto(),
        clienteInicial: clienteVacioContexto(),
    }
}

export const cargarContexto: ProcesarCliente = async (contexto, payload) => {
    const idCliente = payload as string;
    if (idCliente) {
        return pipeCliente(
            contexto,
            [
                cargarCliente(idCliente),
                abiertoContexto,
            ],
            payload
        );
    } else {
        return getContextoVacio(contexto);
    }
}

export const cambiarCliente: ProcesarCliente = async (contexto, payload) => {
    const cliente = payload as Cliente;
    await patchCliente(contexto.cliente.id, cliente);

    return pipeCliente(contexto, [
        refrescarCliente,
        'ABIERTO',
    ]);
}

export const borrarCliente: ProcesarCliente = async (contexto) => {
    await deleteCliente(contexto.cliente.id);

    return pipeCliente(contexto, [
        getContextoVacio,
        publicar('cliente_borrado', null)
    ]);
}

export const darDeAltaClienteProceso: ProcesarCliente = async (contexto) => {
    await darDeAltaCliente(contexto.cliente.id);

    return pipeCliente(contexto, [
        cargarCliente(contexto.cliente.id),
        abiertoContexto,
    ]);
}

export const darDeBajaClienteProceso: ProcesarCliente = async (contexto, payload) => {
    const fechaBaja = payload as string;
    await darDeBajaCliente(contexto.cliente.id, fechaBaja);

    return pipeCliente(contexto, [
        cargarCliente(contexto.cliente.id),
        abiertoContexto,
    ]);
}

// Re-export meta functions que se usan en sub-contextos
export {
    metaDireccion,
    metaNuevaCuentaBanco,
    metaNuevaDireccion,
    metaNuevoCrmContacto,
    nuevaCuentaBancoVacia,
    nuevaDireccionVacia,
    nuevoCrmContactoVacio,
    puedoMarcarDireccionFacturacion
} from "../dominio.ts";

