import { MetaTabla } from "@olula/componentes/index.js";
import { Criteria, ProcesarContexto } from "@olula/lib/diseño.js";
import {
    ProcesarListaActivaEntidades,
    accionesListaActivaEntidades,
} from "@olula/lib/ListaActivaEntidades.js";
import { OportunidadVenta } from "../diseño.ts";
import { getOportunidadesVenta, patchOportunidadVenta } from "../infraestructura.ts";
import { ContextoMaestroOportunidades, EstadoMaestroOportunidades } from "./diseño.ts";


export const metaTablaOportunidadVenta: MetaTabla<OportunidadVenta> = [
    { id: "probabilidad", cabecera: "Probabilidad", tipo: "numero" },
    { id: "descripcion", cabecera: "Descripción" },
    { id: "nombre_cliente", cabecera: "Cliente" },
    { id: "importe", cabecera: "Total", tipo: "moneda" },
    { id: "fecha_cierre", cabecera: "Fecha Cierre", tipo: "fecha" },
];

type ProcesarOportunidades = ProcesarContexto<EstadoMaestroOportunidades, ContextoMaestroOportunidades>;

const conOportunidades =
    (fn: ProcesarListaActivaEntidades<OportunidadVenta>) =>
        (ctx: ContextoMaestroOportunidades) => ({ ...ctx, oportunidades: fn(ctx.oportunidades) });

export const Oportunidades = accionesListaActivaEntidades(conOportunidades);

export const recargarOportunidades: ProcesarOportunidades = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getOportunidadesVenta(criteria.filtro, criteria.orden, criteria.paginacion);

    return Oportunidades.recargar(contexto, resultado);
}

type PayloadCambioEstadoOportunidad = {
    idOportunidad: string;
    nuevoEstado: string;
};

export const cambiarEstadoOportunidad: ProcesarOportunidades = async (contexto, payload) => {
    const { idOportunidad, nuevoEstado } = payload as PayloadCambioEstadoOportunidad;

    await patchOportunidadVenta(idOportunidad, { estado_id: nuevoEstado });

    const { filtro, orden, paginacion } = contexto.oportunidades.criteria;
    const resultado = await getOportunidadesVenta(filtro, orden, paginacion);

    return Oportunidades.recargar(contexto, resultado);
}