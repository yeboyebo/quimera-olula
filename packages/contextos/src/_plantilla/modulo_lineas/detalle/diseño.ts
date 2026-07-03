import { ListaEntidades } from "@olula/lib/ListaEntidades.js";
import { LineaModulo, ModLin } from "../diseño.js";

export type EstadoDetalleModLin =
    | 'INICIAL'
    | 'ABIERTO'
    | 'BORRANDO'
    | 'CREANDO_LINEA'
    | 'CAMBIANDO_LINEA'
    | 'BORRANDO_LINEA';

export type ContextoDetalleModLin = {
    estado: EstadoDetalleModLin;
    modLin: ModLin;
    lineas: ListaEntidades<LineaModulo>;
};
