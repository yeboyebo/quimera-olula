import { Criteria, ProcesarContexto } from "@olula/lib/diseño.js";
import { accionesListaEntidades, ProcesarListaEntidades } from "@olula/lib/ListaEntidades.js";
import { NuevoPresupuesto } from "../diseño.ts";
import { getPresupuesto, getPresupuestos, postPresupuesto } from "../infraestructura.ts";
import { ContextoMaestroPresupuesto, EstadoMaestroPresupuesto, Presupuesto } from "./diseño.ts";

type ProcesarPresupuestos = ProcesarContexto<EstadoMaestroPresupuesto, ContextoMaestroPresupuesto>;

const conPresupuestos = (fn: ProcesarListaEntidades<Presupuesto>) => (ctx: ContextoMaestroPresupuesto) => ({ ...ctx, presupuestos: fn(ctx.presupuestos) });

export const Presupuestos = accionesListaEntidades(conPresupuestos);

export const recargarPresupuestos: ProcesarPresupuestos = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getPresupuestos(criteria.filtro, criteria.orden, criteria.paginacion);

    return Presupuestos.recargar(contexto, resultado);
}

export const abrirModalCreacion: ProcesarPresupuestos = async (contexto) => {
    return {
        ...contexto,
        estado: 'CREANDO_PRESUPUESTO'
    }
}

export const cerrarModalCreacion: ProcesarPresupuestos = async (contexto) => {
    return {
        ...contexto,
        estado: 'INICIAL'
    }
}

export const crearPresupuestoProceso: ProcesarPresupuestos = async (contexto, payload) => {
    const presupuestoNuevo = payload as NuevoPresupuesto;
    const idPresupuesto = await postPresupuesto(presupuestoNuevo);
    const presupuesto = await getPresupuesto(idPresupuesto);

    const resultado = await Presupuestos.incluir(contexto, presupuesto);
    const nuevoContexto = Array.isArray(resultado) ? resultado[0] : resultado;

    return {
        ...nuevoContexto,
        presupuestos: {
            ...nuevoContexto.presupuestos,
            activo: presupuesto
        },
        estado: 'INICIAL' as EstadoMaestroPresupuesto
    };
}
