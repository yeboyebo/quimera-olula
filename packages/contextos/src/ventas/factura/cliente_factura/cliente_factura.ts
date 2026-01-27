import { Venta } from "#/ventas/venta/diseño.ts";
import { Modelo } from "@olula/lib/diseño.js";
import { MetaModelo } from "@olula/lib/dominio.js";

export interface ModeloClienteFacturaRegistrado extends Modelo {
    idCliente: string,
    nombre: string,
}

export const clienteFacturaRegistradoVacio: ModeloClienteFacturaRegistrado = {
    idCliente: "",
    nombre: "",
}

export const clienteRegistradoDesdeFactura = (venta?: Venta): ModeloClienteFacturaRegistrado => {

    return venta && venta.cliente_id
        ? {
            idCliente: venta.cliente_id,
            nombre: venta.nombre_cliente,
        }
        : clienteFacturaRegistradoVacio;
}

export const metaModeloClienteFacturaRegistrado: MetaModelo<ModeloClienteFacturaRegistrado> = {

    campos: {
        idCliente: { requerido: true },
    }
};

