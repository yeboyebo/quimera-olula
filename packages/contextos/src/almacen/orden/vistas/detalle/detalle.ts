import { ProcesarContexto } from "@olula/lib/diseño.js";
import type { LineaOrdenAlmacen, OrdenAlmacen } from "../../diseño.ts";
import { getOrden } from "../../infraestructura.ts";

export type EstadoOrdenAlmacen = (
    'INICIAL' | 'ABIERTA' | 'BORRANDO' | 'BORRANDO_LINEA'
);

export type ContextoOrdenAlmacen = {
    estado: EstadoOrdenAlmacen,
    orden: OrdenAlmacen;
    lineaActiva: LineaOrdenAlmacen | null;
};

type ProcesarOrden = ProcesarContexto<EstadoOrdenAlmacen, ContextoOrdenAlmacen>;

export const cargarOrden: ProcesarOrden = async (contexto, payload) => {
    const idOrden = payload as string;
    if (!idOrden) {
        return contexto;
    }
    const orden = await getOrden(idOrden);
    return {
        ...contexto,
        estado: 'ABIERTA' as EstadoOrdenAlmacen,
        orden,
    }
}

export const refrescarOrden: ProcesarOrden = async (contexto) => {

    const orden = await getOrden(contexto.orden.id);
    return [
        {
            ...contexto,
            orden,
        },
        [["orden_cambiada", orden]]
    ]
}

export const activarLineaParaBorrar: ProcesarOrden = async (contexto, payload) => {
    return {
        ...contexto,
        estado: 'BORRANDO_LINEA' as EstadoOrdenAlmacen,
        lineaActiva: payload as LineaOrdenAlmacen,
    }
}
