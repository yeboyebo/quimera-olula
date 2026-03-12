import { MetaTabla } from "@olula/componentes/atomos/qtabla.tsx";
import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { Almacen } from "../../diseño.ts";

export type EstadoMaestroAlmacen = "INICIAL" | "CREANDO";

export type ContextoMaestroAlmacen = {
    estado: EstadoMaestroAlmacen;
    almacenes: ListaActivaEntidades<Almacen>;
};

export const metaTablaAlmacen: MetaTabla<Almacen> = [
    { id: "id", cabecera: "Código Almacén" },
    { id: "nombre", cabecera: "Nombre" },
];
