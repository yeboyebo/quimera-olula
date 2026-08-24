import { MetaModelo } from "@olula/lib/dominio.ts";
import {
    LineaPedido,
    NuevaLineaLibrePedido,
    NuevaLineaPedido,
    Pedido,
} from "./diseño.ts";

/**
 * Un pedido que no está pendiente rechaza con 409 los cambios que afectan a lo
 * recibido: crear o borrar líneas, importes, impuestos, artículo, proveedor,
 * grupo de IVA y el propio borrado. Sí acepta observaciones o fecha de entrada.
 */
export const pedidoPendiente = (pedido: Pedido): boolean =>
    pedido.recibido === null || pedido.recibido === "No";

export const descripcionRecibido = (pedido: Pedido): string =>
    pedido.recibido ?? "No";

/** Las líneas sin artículo de catálogo no tienen referencia: solo descripción. */
export const etiquetaLinea = (linea: LineaPedido): string =>
    linea.referencia ? `${linea.referencia}: ${linea.descripcion}` : linea.descripcion;

export const metaLineaPedido: MetaModelo<LineaPedido> = {
    campos: {
        descripcion: { requerido: true },
        cantidad: { requerido: true, tipo: "decimal", decimales: 2 },
        pvpUnitario: { requerido: true, tipo: "moneda", decimales: 2 },
        dtoPorcentual: { tipo: "decimal", decimales: 2 },
        dtoLineal: { tipo: "moneda", decimales: 2 },
        tipoIrpf: { tipo: "decimal", decimales: 2 },
        pvpSinDto: { tipo: "moneda", bloqueado: true },
        pvpTotal: { tipo: "moneda", bloqueado: true },
        tipoIva: { tipo: "decimal", bloqueado: true },
        tipoRecargo: { tipo: "decimal", bloqueado: true },
        cantidadRecibida: { tipo: "decimal", bloqueado: true },
    },
};

export const metaNuevaLineaPedido: MetaModelo<NuevaLineaPedido> = {
    campos: {
        referencia: { requerido: true, tipo: "texto" },
        cantidad: { requerido: true, tipo: "decimal", decimales: 2 },
        pvpUnitario: { requerido: true, tipo: "moneda", decimales: 2 },
    },
};

export const metaNuevaLineaLibrePedido: MetaModelo<NuevaLineaLibrePedido> = {
    campos: {
        descripcion: { requerido: true },
        cantidad: { requerido: true, tipo: "decimal", decimales: 2 },
        pvpUnitario: { requerido: true, tipo: "moneda", decimales: 2 },
    },
};

export const nuevaLineaPedidoVacia = (): NuevaLineaPedido => ({
    referencia: "",
    descripcion: "",
    cantidad: 1,
    pvpUnitario: 0,
});

export const nuevaLineaLibrePedidoVacia = (): NuevaLineaLibrePedido => ({
    descripcion: "",
    cantidad: 1,
    pvpUnitario: 0,
});
