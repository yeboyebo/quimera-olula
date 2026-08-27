import { ListaEntidades } from "@olula/lib/ListaEntidades.ts";
import { Albaran, LineaAlbaran } from "../diseño.ts";

export type EstadoDetalleAlbaran =
    | 'INICIAL'
    | 'ABIERTO'
    | 'BORRANDO'
    | 'CAMBIANDO_PROVEEDOR'
    | 'CREANDO_LINEA'
    | 'CAMBIANDO_LINEA'
    | 'BORRANDO_LINEA';

export type ContextoDetalleAlbaran = {
    estado: EstadoDetalleAlbaran;
    albaran: Albaran;
    lineas: ListaEntidades<LineaAlbaran>;
};
