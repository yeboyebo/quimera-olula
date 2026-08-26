import { MetaModelo } from "@olula/lib/dominio.ts";
import { NuevoPedido, NuevoPedidoProveedorNoRegistrado } from "../diseño.ts";

export const metaNuevoPedido: MetaModelo<NuevoPedido> = {
    campos: {
        proveedorId: { requerido: true },
        numeroProveedor: {},
    },
};

export const metaNuevoPedidoProveedorNoRegistrado: MetaModelo<NuevoPedidoProveedorNoRegistrado> = {
    campos: {
        nombre: { requerido: true },
        idFiscal: { requerido: true },
        numeroProveedor: {},
    },
};

export const nuevoPedidoInicial = (): NuevoPedido => ({
    proveedorId: "",
    nombreProveedor: "",
    fecha: new Date(),
    fechaEntrada: null,
    numeroProveedor: null,
    almacenId: null,
    observaciones: null,
});

export const nuevoPedidoProveedorNoRegistradoInicial = (): NuevoPedidoProveedorNoRegistrado => ({
    nombre: "",
    idFiscal: "",
    fecha: new Date(),
    fechaEntrada: null,
    numeroProveedor: null,
    almacenId: null,
    observaciones: null,
});
