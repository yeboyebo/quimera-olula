import { Criteria, Maquina, ProcesarContexto } from "@olula/lib/diseño.ts";
import {
    accionesListaActivaEntidades,
    ListaActivaEntidades,
    ProcesarListaActivaEntidades,
} from "@olula/lib/ListaActivaEntidades.js";
import { ItemOrdenAlmacen } from "../../diseño.ts";
import { getOrdenes } from "../../infraestructura.ts";

export type Estado = "INICIAL" | "CREANDO";

export type Contexto = {
    estado: Estado;
    ordenes: ListaActivaEntidades<ItemOrdenAlmacen>;
};

const conOrdenes =
    (fn: ProcesarListaActivaEntidades<ItemOrdenAlmacen>) => (ctx: Contexto) => ({
        ...ctx,
        ordenes: fn(ctx.ordenes),
    });

type ProcesarOrdenes = ProcesarContexto<Estado, Contexto>;

export const Ordenes = accionesListaActivaEntidades(conOrdenes);

export const recargarOrdenes: ProcesarOrdenes = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getOrdenes(
        criteria.filtro,
        criteria.orden,
        criteria.paginacion
    );
    return Ordenes.recargar(contexto, resultado);
};

export const getMaquina: () => Maquina<Estado, Contexto> = () => ({
    INICIAL: {
        orden_cambiada: Ordenes.cambiar,
        orden_seleccionada: [Ordenes.activar],
        cancelar_seleccion: Ordenes.desactivar,
        orden_borrada: async (contexto) => {
            if (!contexto.ordenes.activo) {
                return contexto;
            }
            return Ordenes.quitar(contexto, contexto.ordenes.activo);
        },
        orden_creada: Ordenes.incluir,
        recarga_solicitada: recargarOrdenes,
        criteria_cambiado: [Ordenes.filtrar, recargarOrdenes],
        crear: "CREANDO",
    },
    CREANDO: {
        orden_creada: [Ordenes.incluir, "INICIAL"],
        creacion_cancelada: "INICIAL",
    },
});
