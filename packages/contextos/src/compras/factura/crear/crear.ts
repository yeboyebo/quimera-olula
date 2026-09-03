import { MetaModelo } from "@olula/lib/dominio.ts";
import { NuevaFactura, NuevaFacturaProveedorNoRegistrado } from "../diseño.ts";

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
