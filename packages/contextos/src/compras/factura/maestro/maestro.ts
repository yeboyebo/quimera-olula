import { Criteria, ProcesarContexto } from "@olula/lib/diseño.ts";
import { accionesListaActivaEntidades, ProcesarListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.ts";
import { Factura } from "../diseño.ts";
import { getFactura, getFacturas } from "../infraestructura.ts";
import { ContextoMaestroFactura, EstadoMaestroFactura } from "./diseño.ts";

type ProcesarMaestro = ProcesarContexto<EstadoMaestroFactura, ContextoMaestroFactura>;

const conFacturas = (fn: ProcesarListaActivaEntidades<Factura>) =>
    (ctx: ContextoMaestroFactura) => ({ ...ctx, facturas: fn(ctx.facturas) });

export const Facturas = accionesListaActivaEntidades(conFacturas);

export const recargarFacturas: ProcesarMaestro = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getFacturas(criteria);
    return Facturas.recargar(contexto, resultado);
};

export const ampliarFacturas: ProcesarMaestro = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getFacturas(criteria);
    return Facturas.ampliar(contexto, resultado);
};

export const incluirFacturaCreadaPorId: ProcesarMaestro = async (contexto, payload) => {
    const id = payload as string;
    const factura = await getFactura(id);
    return {
        ...contexto,
        estado: "INICIAL",
        facturas: {
            ...contexto.facturas,
            lista: [factura, ...contexto.facturas.lista],
            total: contexto.facturas.total + 1,
            activo: factura.id,
        },
    };
};
