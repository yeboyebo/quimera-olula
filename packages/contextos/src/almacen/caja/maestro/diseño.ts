import { MetaTabla } from "@olula/componentes/index.js";
import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { Caja } from "../diseño.ts";

export type EstadoMaestroCaja = "INICIAL" | "CREANDO_CAJA";

export type ContextoMaestroCaja = {
    estado: EstadoMaestroCaja;
    cajas: ListaActivaEntidades<Caja>;
};

export const metaTablaCaja: MetaTabla<Caja> = [
    { id: "id", cabecera: "Código" },
    // { id: "codigo_almacen", cabecera: "Almacén" },
];
