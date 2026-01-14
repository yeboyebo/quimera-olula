import { Criteria, ProcesarContexto } from "@olula/lib/diseño.js";
import { ArqueoTpv } from "../diseño.ts";
import { getArqueo, getArqueos, postArqueo } from "../infraestructura.ts";
import { ContextoMaestroArqueosTpv, EstadoMaestroArqueosTpv } from "./diseño.ts";

type ProcesarArqueosTpv = ProcesarContexto<EstadoMaestroArqueosTpv, ContextoMaestroArqueosTpv>;



export const recargarArqueos: ProcesarArqueosTpv = async (contexto, payload) => {

    const criteria = payload as Criteria;
    const resultado = await getArqueos(criteria.filtro, criteria.orden, criteria.paginacion);
    const arqueosCargados = resultado.datos

    return {
        ...contexto,
        arqueos: arqueosCargados,
        totalArqueos: resultado.total == -1 ? contexto.totalArqueos : resultado.total,
        arqueoActivo: contexto.arqueoActivo
            ? arqueosCargados.find(v => v.id === contexto.arqueoActivo?.id) ?? null
            : null
    }
}

export const crearArqueo: ProcesarArqueosTpv = async (contexto) => {

    const idArqueo = await postArqueo();
    const arqueo = await getArqueo(idArqueo);
    return {
        ...contexto,
        arqueos: [arqueo, ...contexto.arqueos],
        arqueoActivo: arqueo
    }
}

export const activarArqueo: ProcesarArqueosTpv = async (contexto, payload) => {

    const arqueoActivo = payload as ArqueoTpv;
    return {
        ...contexto,
        arqueoActivo
    }
}

export const desactivarArqueoActivo: ProcesarArqueosTpv = async (contexto) => {

    return {
        ...contexto,
        arqueoActivo: null
    }
}

export const cambiarArqueoEnLista: ProcesarArqueosTpv = async (contexto, payload) => {

    const arqueo = payload as ArqueoTpv;
    return {
        ...contexto,
        arqueos: contexto.arqueos.map(a => a.id === arqueo.id ? arqueo : a)
    }
}

