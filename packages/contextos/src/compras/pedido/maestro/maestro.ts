import { albaranarPedidos } from "#/compras/albaran/infraestructura.ts";
import { Criteria, ProcesarContexto } from "@olula/lib/diseño.ts";
import { accionesListaActivaEntidades, ProcesarListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.ts";
import { Pedido } from "../diseño.ts";
import { pedidoAlbaranable } from "../dominio.ts";
import { getPedido, getPedidos } from "../infraestructura.ts";
import { ContextoMaestroPedido, EstadoMaestroPedido } from "./diseño.ts";

type ProcesarMaestro = ProcesarContexto<EstadoMaestroPedido, ContextoMaestroPedido>;

const conPedidos = (fn: ProcesarListaActivaEntidades<Pedido>) =>
    (ctx: ContextoMaestroPedido) => ({ ...ctx, pedidos: fn(ctx.pedidos) });

export const Pedidos = accionesListaActivaEntidades(conPedidos);

export const recargarPedidos: ProcesarMaestro = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getPedidos(criteria);
    return Pedidos.recargar(contexto, resultado);
};

export const ampliarPedidos: ProcesarMaestro = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getPedidos(criteria);
    return Pedidos.ampliar(contexto, resultado);
};

export const incluirPedidoCreadoPorId: ProcesarMaestro = async (contexto, payload) => {
    const id = payload as string;
    const pedido = await getPedido(id);
    return {
        ...contexto,
        estado: "INICIAL",
        pedidos: {
            ...contexto.pedidos,
            lista: [pedido, ...contexto.pedidos.lista],
            total: contexto.pedidos.total + 1,
            activo: pedido.id,
        },
    };
};

export const seleccionadosCambiados: ProcesarMaestro = async (contexto, payload) => ({
    ...contexto,
    seleccionados: payload as string[],
});

const pedidosDe = (ids: string[], pedidos: Pedido[]): Pedido[] =>
    ids.map((id) => pedidos.find((p) => p.id === id)).filter((p): p is Pedido => !!p);

export const pedidosHomogeneos = (ids: string[], pedidos: Pedido[]): boolean => {
    const elegidos = pedidosDe(ids, pedidos);
    if (elegidos.length === 0) return false;

    const clave = (pedido: Pedido) =>
        [pedido.proveedorId, pedido.serieId, pedido.almacenId, pedido.formaPagoId].join("|");

    return elegidos.every((pedido) => clave(pedido) === clave(elegidos[0]));
};

export const puedenAlbaranarse = (ids: string[], pedidos: Pedido[]): boolean => {
    const elegidos = pedidosDe(ids, pedidos);
    if (elegidos.length === 0 || elegidos.length !== ids.length) return false;

    return elegidos.every(pedidoAlbaranable) && pedidosHomogeneos(ids, pedidos);
};

export const albaranarSeleccionados: ProcesarMaestro = async (contexto) => {
    const albaranCreado = await albaranarPedidos(contexto.seleccionados);

    const resultado = await getPedidos(contexto.pedidos.criteria);
    const recargado = (await Pedidos.recargar(contexto, resultado)) as ContextoMaestroPedido;

    return {
        ...recargado,
        estado: "ALBARAN_CREADO",
        seleccionados: [],
        albaranCreado,
    };
};
