import { OrdenAlmacen } from "#/almacen/orden/diseño.ts";
import { NuevaLecturaOrden } from "./diseño.ts";

export const getNuevaLecturaOrdenVacia = (orden: OrdenAlmacen): NuevaLecturaOrden => ({
    cantidad: 1,
    sku: "",
    articulo: "",
    idLote: null,
    idUbicacionDestino: orden.ubicacionDestinoId,
    idCajaDestino: orden.cajaDestinoId,
    // codUbicacionDestino: orden.codUbicacionDestino,
    idCajaOrigen: orden.cajaOrigenId,
    idUbicacionOrigen: orden.ubicacionOrigenId,
    // codUbicacionOrigen: orden.codUbicacionOrigen,
});
