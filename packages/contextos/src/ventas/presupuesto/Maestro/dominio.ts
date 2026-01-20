import { Criteria, ProcesarContexto } from "@olula/lib/diseño.js";
import { getPresupuestos } from "../infraestructura.ts";
import { ContextoMaestroPresupuesto, EstadoMaestroPresupuesto, Presupuesto } from "./diseño.ts";

type ProcesarPresupuestos = ProcesarContexto<EstadoMaestroPresupuesto, ContextoMaestroPresupuesto>;

export const cambiarPresupuestoEnLista: ProcesarPresupuestos = async (contexto, payload) => {
    const presupuesto = payload as Presupuesto;
    return {
        ...contexto,
        presupuestos: contexto.presupuestos.map(p => p.id === presupuesto.id ? presupuesto : p)
    }
}

export const activarPresupuesto: ProcesarPresupuestos = async (contexto, payload) => {
    const presupuestoActivo = payload as Presupuesto;
    return {
        ...contexto,
        presupuestoActivo
    }
}

export const desactivarPresupuestoActivo: ProcesarPresupuestos = async (contexto) => {
    return {
        ...contexto,
        presupuestoActivo: null
    }
}

export const quitarPresupuestoDeLista: ProcesarPresupuestos = async (contexto, payload) => {
    const presupuestoBorrado = payload as Presupuesto;
    return {
        ...contexto,
        presupuestos: contexto.presupuestos.filter(p => p.id !== presupuestoBorrado.id),
        presupuestoActivo: null
    }
}

export const recargarPresupuestos: ProcesarPresupuestos = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getPresupuestos(criteria.filtro, criteria.orden, criteria.paginacion);
    const presupuestosCargados = resultado.datos;

    return {
        ...contexto,
        presupuestos: presupuestosCargados,
        totalPresupuestos: resultado.total == -1 ? contexto.totalPresupuestos : resultado.total,
        presupuestoActivo: contexto.presupuestoActivo
            ? presupuestosCargados.find(p => p.id === contexto.presupuestoActivo?.id) ?? null
            : null
    }
}

export const incluirPresupuestoEnLista: ProcesarPresupuestos = async (contexto, payload) => {
    const presupuesto = payload as Presupuesto;
    return {
        ...contexto,
        presupuestos: [presupuesto, ...contexto.presupuestos]
    }
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
