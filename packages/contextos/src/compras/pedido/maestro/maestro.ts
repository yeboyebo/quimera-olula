import { Criteria, ProcesarContexto } from "@olula/lib/diseño.ts";
import { accionesListaActivaEntidades, ProcesarListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.ts";
import { Pedido } from "../diseño.ts";
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
