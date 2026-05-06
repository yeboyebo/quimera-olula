import { Criteria, ProcesarContexto } from "@olula/lib/diseño.ts";
import {
    accionesListaActivaEntidades,
    ProcesarListaActivaEntidades,
} from "@olula/lib/ListaActivaEntidades.js";
import { Almacen } from "../../diseño.ts";
import { getAlmacenes } from "../../infraestructura.ts";
import { ContextoMaestroAlmacen, EstadoMaestroAlmacen } from "./diseño.ts";

type ProcesarMaestroAlmacen = ProcesarContexto<EstadoMaestroAlmacen, ContextoMaestroAlmacen>;

const conAlmacenes =
    (fn: ProcesarListaActivaEntidades<Almacen>) =>
        (ctx: ContextoMaestroAlmacen) => ({ ...ctx, almacenes: fn(ctx.almacenes) });

export const Almacenes = accionesListaActivaEntidades(conAlmacenes);

export const recargarAlmacenes: ProcesarMaestroAlmacen = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getAlmacenes(criteria.filtro, criteria.orden, criteria.paginacion);

    return Almacenes.recargar(contexto, resultado);
};
