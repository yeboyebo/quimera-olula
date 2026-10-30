import { ListaEntidades } from "@olula/lib/ListaEntidades.js";
import { ArticuloTarifa, Tarifa } from "../diseño.js";

/**
 * Estados posibles en la vista de detalle.
 *
 * Los tres últimos activan los modales del sub-recurso (artículos de la tarifa),
 * igual que CREANDO_LINEA / CAMBIANDO_LINEA / BORRANDO_LINEA en la plantilla
 * de módulo con líneas.
 */
export type EstadoDetalleTarifa =
    | 'INICIAL'
    | 'ABIERTO'
    | 'BORRANDO'
    | 'CREANDO_ARTICULO'
    | 'CAMBIANDO_ARTICULO'
    | 'BORRANDO_ARTICULO';

/**
 * Contexto del detalle (edición de una tarifa y de sus precios por artículo)
 */
export type ContextoDetalleTarifa = {
    estado: EstadoDetalleTarifa;
    tarifa: Tarifa;
    articulos: ListaEntidades<ArticuloTarifa>;
};
