import { Venta } from "#/ventas/venta/diseño.ts";
import { Modelo } from "@olula/lib/diseño.js";
import { MetaModelo } from "@olula/lib/dominio.js";

export type ModeloClienteVentaRegistrado = {
    idCliente: string,
    idDireccion: string,
    nombre: string,
}

export interface ModeloClienteVentaNoRegistrado extends Modelo {
    nombre: string;
    idFiscal: string;
    nombreVia: string;
    tipoVia?: string;
    numero?: string;
    otros?: string;
    codPostal: string;
    ciudad?: string;
    idProvincia?: string;
    provincia?: string;
    idPais?: string;
    apartado?: string;
    telefono?: string;
}

export const clienteRegistradoVacio: ModeloClienteVentaRegistrado = {
    idCliente: "",
    idDireccion: "",
    nombre: "",
}

export const clienteRegistradoDesdeVenta = (venta?: Venta): ModeloClienteVentaRegistrado => {

    return venta && venta.cliente_id
        ? {
            idCliente: venta.cliente_id,
            idDireccion: venta.direccion_id,
            nombre: venta.nombre_cliente,
        }
        : clienteRegistradoVacio;
}

export const clienteNoRegistradoDesdeVenta = (venta?: Venta): ModeloClienteVentaNoRegistrado => {

    return venta && !venta.cliente_id
        ? {
            nombre: venta.nombre_cliente,
            idFiscal: venta.id_fiscal,
            nombreVia: venta.direccion.nombre_via,
            codPostal: venta.direccion.cod_postal,
        }
        : clienteVentaNoRegistradoVacio;
}

export const clienteVentaNoRegistradoVacio: ModeloClienteVentaNoRegistrado = {
    nombre: "",
    idFiscal: "",
    nombreVia: "",
    tipoVia: "",
    numero: "",
    otros: "",
    codPostal: "",
    ciudad: "",
    idProvincia: "",
    provincia: "",
    idPais: "",
    apartado: "",
    telefono: "",
}

export const metaModeloClienteVentaRegistrado: MetaModelo<ModeloClienteVentaRegistrado> = {

    campos: {
        idCliente: { requerido: true },
        idDireccion: { requerido: true },
    }
};

export const metaModeloClienteVentaNoRegistrado: MetaModelo<ModeloClienteVentaNoRegistrado> = {

    campos: {
        nombre: { requerido: true },
        idFical: { requerido: true },
        nombreVia: { requerido: true },
    }
};