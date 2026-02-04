import { Criteria, ProcesarContexto } from "@olula/lib/diseño.js";
import { ProcesarListaEntidades, accionesListaEntidades } from "@olula/lib/ListaEntidades.js";
import { ArqueoTpv } from "../diseño.ts";
import { getArqueo, getArqueos, postArqueo } from "../infraestructura.ts";
import { ContextoMaestroArqueosTpv, EstadoMaestroArqueosTpv } from "./diseño.ts";

type ProcesarArqueosTpv = ProcesarContexto<EstadoMaestroArqueosTpv, ContextoMaestroArqueosTpv>;


const conArqueos = (fn: ProcesarListaEntidades<ArqueoTpv>) => (ctx: ContextoMaestroArqueosTpv) => ({ ...ctx, arqueos: fn(ctx.arqueos) });

export const Arqueos = accionesListaEntidades(conArqueos);

export const recargarArqueos: ProcesarArqueosTpv = async (contexto, payload) => {

    const criteria = payload as Criteria;
    const resultado = await getArqueos(criteria.filtro, criteria.orden, criteria.paginacion);
    const arqueosCargados = resultado.datos

    return {
        ...contexto,
        arqueos: {
            lista: arqueosCargados,
            total: resultado.total == -1 ? contexto.arqueos.total : resultado.total,
            activo: contexto.arqueos.activo
                ? arqueosCargados.find(a => a.id === contexto.arqueos.activo?.id) ?? null
                : null
        }
        // totalArqueos: resultado.total == -1 ? contexto.totalArqueos : resultado.total,
        // arqueoActivo: contexto.arqueoActivo
        //     ? arqueosCargados.find(v => v.id === contexto.arqueoActivo?.id) ?? null
        //     : null
    }
}

export const crearArqueo: ProcesarArqueosTpv = async (contexto) => {

    const idArqueo = await postArqueo();
    const arqueo = await getArqueo(idArqueo);
    return {
        ...contexto,
        arqueos: {
            lista: [arqueo, ...contexto.arqueos.lista],
            activo: arqueo,
            total: contexto.arqueos.total + 1,
        }
    }
}

// export const activarArqueo: ProcesarArqueosTpv = async (contexto, payload) => {

//     const arqueoActivo = payload as ArqueoTpv;
//     return {
//         ...contexto,
//         arqueoActivo
//     }
// }

// export const desactivarArqueoActivo: ProcesarArqueosTpv = async (contexto) => {

//     return {
//         ...contexto,
//         arqueoActivo: null
//     }
// }

// export const cambiarArqueoEnLista: ProcesarArqueosTpv = async (contexto, payload) => {

//     const arqueo = payload as ArqueoTpv;
//     return {
//         ...contexto,
//         arqueos: {
//             ...contexto.arqueos,
//             lista: contexto.arqueos.lista.map(a => a.id === arqueo.id ? arqueo : a)
//         }
//     }
// }

