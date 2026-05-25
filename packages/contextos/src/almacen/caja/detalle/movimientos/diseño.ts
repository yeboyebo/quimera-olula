import { ListaEntidades } from "@olula/lib/ListaEntidades.js";
import { MovimientoCaja } from "../../diseño.ts";

export type EstadoMovimientos = "lista";

export type ContextoMovimientos = {
    estado: EstadoMovimientos;
    movimientos: ListaEntidades<MovimientoCaja>;
    cargando: boolean;
    cajaId: string;
    formulario: {
        codBarras: string;
        cantidad: string;
    };
};
