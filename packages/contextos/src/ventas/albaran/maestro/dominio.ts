import { Criteria, ProcesarContexto } from "@olula/lib/diseño.js";
import { Albaran } from "../diseño.ts";
import { getAlbaranes } from "../infraestructura.ts";
import { ContextoMaestroAlbaran, EstadoMaestroAlbaran } from "./diseño.ts";

type ProcesarAlbaranes = ProcesarContexto<EstadoMaestroAlbaran, ContextoMaestroAlbaran>;

export const cambiarAlbaranEnLista: ProcesarAlbaranes = async (contexto, payload) => {
    const albaran = payload as Albaran;
    return {
        ...contexto,
        albaranes: contexto.albaranes.map(a => a.id === albaran.id ? albaran : a)
    }
}

export const activarAlbaran: ProcesarAlbaranes = async (contexto, payload) => {
    const albaranActivo = payload as Albaran;
    return {
        ...contexto,
        albaranActivo
    }
}

export const desactivarAlbaranActivo: ProcesarAlbaranes = async (contexto) => {
    return {
        ...contexto,
        albaranActivo: null
    }
}

export const quitarAlbaranDeLista: ProcesarAlbaranes = async (contexto, payload) => {
    const albaranBorrado = payload as Albaran;

    return {
        ...contexto,
        albaranes: contexto.albaranes.filter(a => a.id !== albaranBorrado.id),
        albaranActivo: null
    }
}

export const recargarAlbaranes: ProcesarAlbaranes = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getAlbaranes(criteria.filtro, criteria.orden, criteria.paginacion);
    const albaranesCargados = resultado.datos;

    return {
        ...contexto,
        albaranes: albaranesCargados,
        totalAlbaranes: resultado.total == -1 ? contexto.totalAlbaranes : resultado.total,
        albaranActivo: contexto.albaranActivo
            ? albaranesCargados.find(a => a.id === contexto.albaranActivo?.id) ?? null
            : null
    }
}

export const incluirAlbaranEnLista: ProcesarAlbaranes = async (contexto, payload) => {
    const albaran = payload as Albaran;
    return {
        ...contexto,
        albaranes: [albaran, ...contexto.albaranes]
    }
}

export const crearAlbaran: ProcesarAlbaranes = async (contexto, payload) => {
    const albaran = payload as Albaran;
    return {
        ...contexto,
        albaranes: [albaran, ...contexto.albaranes],
        albaranActivo: albaran
    }
}
