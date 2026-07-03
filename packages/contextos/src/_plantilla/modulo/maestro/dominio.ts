import { Criteria, ProcesarContexto } from "@olula/lib/diseño.ts";
import { accionesListaActivaEntidades, ProcesarListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { Modulo, NuevoModulo } from "../diseño.js";
import { getModulo, getModulos, postModulo } from "../infraestructura.js";
import { ContextoMaestroModulo, EstadoMaestroModulo } from "./diseño.js";

/**
 * Tipo para todos los handlers del maestro
 */
type ProcesarMaestro = ProcesarContexto<EstadoMaestroModulo, ContextoMaestroModulo>;

/**
 * Patrón: usar accionesListaActivaEntidades para reducir código.
 * Genera automáticamente: cambiar, activar, desactivar, incluir, quitar,
 * recargar, ampliar (paginación incremental), filtrar (cambio de criteria).
 */
const conModulos = (fn: ProcesarListaActivaEntidades<Modulo>) =>
    (ctx: ContextoMaestroModulo) => ({ ...ctx, modulos: fn(ctx.modulos) });

export const Modulos = accionesListaActivaEntidades(conModulos);

/**
 * Recargar lista desde API (reemplaza la lista entera)
 */
export const recargarModulos: ProcesarMaestro = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getModulos(criteria.filtro, criteria.orden, criteria.paginacion);
    return Modulos.recargar(contexto, resultado);
};

/**
 * Ampliar lista (paginación incremental: añade elementos a los existentes)
 * Se usa con el evento "siguiente_pagina"
 */
export const ampliarModulos: ProcesarMaestro = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getModulos(criteria.filtro, criteria.orden, criteria.paginacion);
    return Modulos.ampliar(contexto, resultado);
};

/**
 * Crear nuevo módulo y activarlo inmediatamente
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
            activo: modulo.id,  // activo es el ID (string), no la entidad
        },
    };
};
