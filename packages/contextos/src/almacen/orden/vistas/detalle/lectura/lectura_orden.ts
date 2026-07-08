import { OrdenAlmacen } from "#/almacen/orden/diseño.ts";
import { NuevaLecturaOrden } from "./diseño.ts";

export const getNuevaLecturaOrdenVacia = (orden: OrdenAlmacen): NuevaLecturaOrden => ({
    cantidad: 1,
    sku: "",
    idLote: null,
    idUbicacionDestino: orden.ubicacionDestinoId,
    idUbicacionOrigen: orden.ubicacionOrigenId,
});
