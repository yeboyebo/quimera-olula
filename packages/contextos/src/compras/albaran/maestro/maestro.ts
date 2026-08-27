import { facturarAlbaranes } from "#/compras/factura/infraestructura.ts";
import { Criteria, ProcesarContexto } from "@olula/lib/diseño.ts";
import { accionesListaActivaEntidades, ProcesarListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.ts";
import { Albaran } from "../diseño.ts";
import { albaranFacturado } from "../dominio.ts";
import { getAlbaran, getAlbaranes } from "../infraestructura.ts";
import { ContextoMaestroAlbaran, EstadoMaestroAlbaran } from "./diseño.ts";

type ProcesarMaestro = ProcesarContexto<EstadoMaestroAlbaran, ContextoMaestroAlbaran>;

const conAlbaranes = (fn: ProcesarListaActivaEntidades<Albaran>) =>
    (ctx: ContextoMaestroAlbaran) => ({ ...ctx, albaranes: fn(ctx.albaranes) });

export const Albaranes = accionesListaActivaEntidades(conAlbaranes);

export const recargarAlbaranes: ProcesarMaestro = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getAlbaranes(criteria);
    return Albaranes.recargar(contexto, resultado);
};

export const ampliarAlbaranes: ProcesarMaestro = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getAlbaranes(criteria);
    return Albaranes.ampliar(contexto, resultado);
};

export const incluirAlbaranCreadoPorId: ProcesarMaestro = async (contexto, payload) => {
    const id = payload as string;
    const albaran = await getAlbaran(id);
    return {
        ...contexto,
        estado: "INICIAL",
        albaranes: {
            ...contexto.albaranes,
            lista: [albaran, ...contexto.albaranes.lista],
            total: contexto.albaranes.total + 1,
            activo: albaran.id,
        },
    };
};

export const seleccionadosCambiados: ProcesarMaestro = async (contexto, payload) => ({
    ...contexto,
    seleccionados: payload as string[],
});

const albaranesDe = (ids: string[], albaranes: Albaran[]): Albaran[] =>
    ids.map((id) => albaranes.find((a) => a.id === id)).filter((a): a is Albaran => !!a);

export const albaranesHomogeneos = (ids: string[], albaranes: Albaran[]): boolean => {
    const elegidos = albaranesDe(ids, albaranes);
    if (elegidos.length === 0) return false;

    const clave = (albaran: Albaran) =>
        [albaran.proveedorId, albaran.serieId, albaran.almacenId, albaran.formaPagoId].join("|");

    return elegidos.every((albaran) => clave(albaran) === clave(elegidos[0]));
};

export const puedenFacturarse = (ids: string[], albaranes: Albaran[]): boolean => {
    const elegidos = albaranesDe(ids, albaranes);
    if (elegidos.length === 0 || elegidos.length !== ids.length) return false;

    return elegidos.every((albaran) => !albaranFacturado(albaran))
        && albaranesHomogeneos(ids, albaranes);
};

export const facturarSeleccionados: ProcesarMaestro = async (contexto) => {
    const facturaCreada = await facturarAlbaranes(contexto.seleccionados);

    const resultado = await getAlbaranes(contexto.albaranes.criteria);
    const recargado = (await Albaranes.recargar(contexto, resultado)) as ContextoMaestroAlbaran;

    return { ...recargado, estado: "FACTURA_CREADA", seleccionados: [], facturaCreada };
};
