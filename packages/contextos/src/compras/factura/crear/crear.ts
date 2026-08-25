import { MetaModelo } from "@olula/lib/dominio.ts";
import { NuevaFactura, NuevaFacturaProveedorNoRegistrado } from "../diseño.ts";

/*
 * El alta pide lo mínimo: el resto lo hereda el servidor en cascada
 * (comando → proveedor → empresa). La fecha no se muestra, se manda la de hoy,
 * y la hora la pone el servidor.
 *
 * numeroProveedor es el número que el proveedor puso en su factura, no el
 * correlativo interno; por eso sí se pregunta al dar de alta.
 */

export const metaNuevaFactura: MetaModelo<NuevaFactura> = {
    campos: {
        proveedorId: { requerido: true },
        numeroProveedor: {},
        deAbono: { tipo: "checkbox" },
    },
};

export const metaNuevaFacturaProveedorNoRegistrado: MetaModelo<NuevaFacturaProveedorNoRegistrado> = {
    campos: {
        nombre: { requerido: true },
        idFiscal: { requerido: true },
        numeroProveedor: {},
        deAbono: { tipo: "checkbox" },
    },
};

export const nuevaFacturaInicial = (): NuevaFactura => ({
    proveedorId: "",
    nombreProveedor: "",
    fecha: new Date(),
    numeroProveedor: null,
    almacenId: null,
    observaciones: null,
    deAbono: false,
});

export const nuevaFacturaProveedorNoRegistradoInicial = (): NuevaFacturaProveedorNoRegistrado => ({
    nombre: "",
    idFiscal: "",
    fecha: new Date(),
    numeroProveedor: null,
    almacenId: null,
    observaciones: null,
    deAbono: false,
});
