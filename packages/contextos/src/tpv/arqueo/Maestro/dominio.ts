import { Criteria, ProcesarContexto } from "@olula/lib/diseño.js";
import { ProcesarListaActivaEntidades, accionesListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { CabeceraArqueoTpv } from "../diseño.ts";
import { getArqueo, getArqueos, postArqueo } from "../infraestructura.ts";
import { ContextoMaestroArqueosTpv, EstadoMaestroArqueosTpv } from "./diseño.ts";

type ProcesarArqueosTpv = ProcesarContexto<EstadoMaestroArqueosTpv, ContextoMaestroArqueosTpv>;


const conArqueos = (fn: ProcesarListaActivaEntidades<CabeceraArqueoTpv>) => (ctx: ContextoMaestroArqueosTpv) => ({ ...ctx, arqueos: fn(ctx.arqueos) });

export const Arqueos = accionesListaActivaEntidades(conArqueos);

export const recargarArqueos: ProcesarArqueosTpv = async (contexto, payload) => {

    const criteria = payload as Criteria;
    const resultado = await getArqueos(criteria.filtro, criteria.orden, criteria.paginacion);

    return Arqueos.recargar(contexto, resultado);
}

export const crearArqueo: ProcesarArqueosTpv = async (contexto) => {

    const idArqueo = await postArqueo();
    const arqueo = await getArqueo(idArqueo);
    return {
        ...contexto,
        arqueos: {
            lista: [arqueo, ...contexto.arqueos.lista],
            activo: arqueo.id,
            total: contexto.arqueos.total + 1,
            criteria: contexto.arqueos.criteria,
        }
    }
}

