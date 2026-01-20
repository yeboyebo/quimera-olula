// Dominio de maestro
import { Criteria, ProcesarContexto } from "@olula/lib/diseño.ts";
import { Cliente } from "../diseño.ts";
import { getClientes } from "../infraestructura.ts";
import { ContextoMaestroCliente, EstadoMaestroCliente } from "./diseño.ts";

export type ProcesarMaestroCliente = ProcesarContexto<EstadoMaestroCliente, ContextoMaestroCliente>;

export const cambiarClienteEnLista: ProcesarMaestroCliente = async (contexto, payload) => {
    const cliente = payload as Cliente;
    return {
        ...contexto,
        clientes: contexto.clientes.map(c => c.id === cliente.id ? cliente : c)
    }
}

export const activarCliente: ProcesarMaestroCliente = async (contexto, payload) => {
    const clienteActivo = payload as Cliente;
    return {
        ...contexto,
        clienteActivo
    }
}

export const desactivarClienteActivo: ProcesarMaestroCliente = async (contexto) => {
    return {
        ...contexto,
        clienteActivo: null
    }
}

export const quitarClienteDeLista: ProcesarMaestroCliente = async (contexto, payload) => {
    const clienteBorrado = payload as Cliente;
    return {
        ...contexto,
        clientes: contexto.clientes.filter(c => c.id !== clienteBorrado.id),
        clienteActivo: null
    }
}

export const recargarClientes: ProcesarMaestroCliente = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getClientes(criteria.filtro, criteria.orden, criteria.paginacion);
    const clientesCargados = resultado.datos;

    return {
        ...contexto,
        clientes: clientesCargados,
        totalClientes: resultado.total == -1 ? contexto.totalClientes : resultado.total,
        clienteActivo: contexto.clienteActivo
            ? clientesCargados.find(c => c.id === contexto.clienteActivo?.id) ?? null
            : null
    }
}

export const incluirClienteEnLista: ProcesarMaestroCliente = async (contexto, payload) => {
    const cliente = payload as Cliente;
    return {
        ...contexto,
        clientes: [cliente, ...contexto.clientes]
    }
}

