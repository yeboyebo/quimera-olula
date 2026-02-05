import { Criteria, ProcesarContexto } from "@olula/lib/diseño.ts";
import { accionesListaEntidades, ProcesarListaEntidades } from "@olula/lib/ListaEntidades.js";
import { Modulo, NuevoModulo } from "../diseño.ts";
import { getModulo, getModulos, postModulo } from "../infraestructura.ts";
import { ContextoMaestroModulo, EstadoMaestroModulo } from "./diseño.ts";

/**
 * Tipo para todos los handlers del maestro
 */
type ProcesarMaestro = ProcesarContexto<EstadoMaestroModulo, ContextoMaestroModulo>;

/**
 * Patrón: usar accionesListaEntidades para reducir código
 * Automáticamente genera: cambiar, activar, desactivar, incluir, quitar, recargar
 */
const conModulos = (fn: ProcesarListaEntidades<Modulo>) =>
    (ctx: ContextoMaestroModulo) => ({ ...ctx, modulos: fn(ctx.modulos) });

export const Modulos = accionesListaEntidades(conModulos);

/**
 * Recargar lista desde API
 */
export const recargarModulos: ProcesarMaestro = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getModulos(criteria.filtro, criteria.orden, criteria.paginacion);
    return Modulos.recargar(contexto, resultado);
};

/**
 * Crear nuevo módulo
 */
export const crearModuloProceso: ProcesarMaestro = async (contexto, payload) => {
    const nuevoModulo = payload as NuevoModulo;
    const idModulo = await postModulo(nuevoModulo);
    const modulo = await getModulo(idModulo);
    const resultado = await Modulos.incluir(contexto, modulo);

    return {
        ...resultado,
        modulos: {
            ...resultado.modulos,
            activo: modulo,
        },
        estado: 'INICIAL' as EstadoMaestroModulo,
    };
};
