import { Almacen } from "../../diseño.ts";

export type EstadoAlmacen = "INICIAL" | "Editando" | "Borrando";

export type ContextoAlmacen = {
    estado: EstadoAlmacen;
    almacen: Almacen;
    almacenInicial: Almacen;
};
