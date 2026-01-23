import { Criteria, ProcesarContexto } from "@olula/lib/diseño.js";
import {
    NuevoPedido,
    Pedido
} from "../diseño.ts";
import {
    getPedido,
    getPedidos,
    postPedido
} from "../infraestructura.ts";
import { ContextoMaestroPedido, EstadoMaestroPedido } from "./diseño.ts";

type ProcesarPedidos = ProcesarContexto<EstadoMaestroPedido, ContextoMaestroPedido>;

export const cambiarPedidoEnLista: ProcesarPedidos = async (contexto, payload) => {
    const pedido = payload as Pedido;
    return {
        ...contexto,
        pedidos: contexto.pedidos.map(p => p.id === pedido.id ? pedido : p)
    }
}

export const activarPedido: ProcesarPedidos = async (contexto, payload) => {
    const pedidoActivo = payload as Pedido;
    return {
        ...contexto,
        pedidoActivo
    }
}

export const desactivarPedidoActivo: ProcesarPedidos = async (contexto) => {
    return {
        ...contexto,
        pedidoActivo: null
    }
}

export const quitarPedidoDeLista: ProcesarPedidos = async (contexto, payload) => {
    const pedidoBorrado = payload as Pedido;
    return {
        ...contexto,
        pedidos: contexto.pedidos.filter(p => p.id !== pedidoBorrado.id),
        pedidoActivo: null
    }
}

export const recargarPedidos: ProcesarPedidos = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getPedidos(criteria.filtro, criteria.orden, criteria.paginacion);
    const pedidosCargados = resultado.datos;

    return {
        ...contexto,
        pedidos: pedidosCargados,
        totalPedidos: resultado.total == -1 ? contexto.totalPedidos : resultado.total,
        pedidoActivo: contexto.pedidoActivo
            ? pedidosCargados.find(p => p.id === contexto.pedidoActivo?.id) ?? null
            : null
    }
}

export const incluirPedidoEnLista: ProcesarPedidos = async (contexto, payload) => {
    const pedido = payload as Pedido;
    return {
        ...contexto,
        pedidos: [pedido, ...contexto.pedidos]
    }
}

export const abrirModalCreacion: ProcesarPedidos = async (contexto) => {
    return {
        ...contexto,
        estado: 'CREANDO_PEDIDO'
    }
}

export const cerrarModalCreacion: ProcesarPedidos = async (contexto) => {
    return {
        ...contexto,
        estado: 'INICIAL'
    }
}

export const crearPedido: ProcesarPedidos = async (contexto, payload) => {
    const pedidoNuevo = payload as NuevoPedido;
    const idPedido = await postPedido(pedidoNuevo);
    const pedido = await getPedido(idPedido);
    return {
        ...contexto,
        pedidos: [pedido, ...contexto.pedidos],
        pedidoActivo: pedido
    }
}
