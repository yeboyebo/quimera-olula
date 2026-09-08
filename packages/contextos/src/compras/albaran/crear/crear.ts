import { MetaModelo } from "@olula/lib/dominio.ts";
import { NuevoAlbaran, NuevoAlbaranProveedorNoRegistrado } from "../diseño.ts";

export const metaNuevoAlbaran: MetaModelo<NuevoAlbaran> = {
    campos: {
        proveedorId: { requerido: true },
        numeroProveedor: {},
    },
};

export const metaNuevoAlbaranProveedorNoRegistrado: MetaModelo<NuevoAlbaranProveedorNoRegistrado> = {
    campos: {
        nombre: { requerido: true },
        idFiscal: { requerido: true },
        numeroProveedor: {},
    },
};

export const nuevoAlbaranInicial = (): NuevoAlbaran => ({
    proveedorId: "",
    nombreProveedor: "",
    fecha: new Date(),
    numeroProveedor: null,
    almacenId: null,
    observaciones: null,
});

export const nuevoAlbaranProveedorNoRegistradoInicial = (): NuevoAlbaranProveedorNoRegistrado => ({
    nombre: "",
    idFiscal: "",
    fecha: new Date(),
    numeroProveedor: null,
    almacenId: null,
    observaciones: null,
});
