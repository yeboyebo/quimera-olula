import { Criteria, ProcesarContexto } from "@olula/lib/diseño.ts";
import {
    accionesListaActivaEntidades,
    ProcesarListaActivaEntidades,
} from "@olula/lib/ListaActivaEntidades.js";
import { Tarifa } from "../diseño.js";
import { getTarifa, getTarifas } from "../infraestructura.js";
import { ContextoMaestroTarifa, EstadoMaestroTarifa } from "./diseño.js";

/**
 * Tipo para todos los handlers del maestro
 */
type ProcesarMaestro = ProcesarContexto<EstadoMaestroTarifa, ContextoMaestroTarifa>;

const conTarifas = (fn: ProcesarListaActivaEntidades<Tarifa>) =>
    (ctx: ContextoMaestroTarifa) => ({ ...ctx, tarifas: fn(ctx.tarifas) });

export const Tarifas = accionesListaActivaEntidades(conTarifas);

/**
 * Recargar lista desde API (reemplaza la lista entera)
 */
export const recargarTarifas: ProcesarMaestro = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getTarifas(criteria);
    return Tarifas.recargar(contexto, resultado);
};

/**
 * Ampliar lista (paginación incremental: añade elementos a los existentes)
 */
export const ampliarTarifas: ProcesarMaestro = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getTarifas(criteria);
    return Tarifas.ampliar(contexto, resultado);
};

/**
 * Incluir tarifa recién creada por ID (flujo con modal CrearTarifa).
 * El modal ya realizó el POST; aquí se obtiene la entidad completa y se incluye.
 */
export const incluirTarifaCreadaPorId: ProcesarMaestro = async (contexto, payload) => {
    const id = payload as string;
    const tarifa = await getTarifa(id);
    return {
        ...contexto,
        estado: "INICIAL",
        tarifas: {
            ...contexto.tarifas,
            lista: [tarifa, ...contexto.tarifas.lista],
            total: contexto.tarifas.total + 1,
            activo: tarifa.id,
        },
    };
};
