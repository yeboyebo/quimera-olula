import { MetaModelo } from "@olula/lib/dominio.ts";
import { articuloDeLineaValido, getTipoArticulo } from "../comun/dominio.ts";
import {
    LineaPedido,
    ModeloLineaPedido,
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

/** Queda algo por recibir mientras el pedido no esté recibido del todo. */
export const pedidoAlbaranable = (pedido: Pedido): boolean => pedido.recibido !== "Sí";

/** Las líneas sin artículo de catálogo no tienen referencia: solo descripción. */
export const etiquetaLinea = (linea: LineaPedido): string =>
    linea.referencia ? `${linea.referencia}: ${linea.descripcion}` : linea.descripcion;

/** La línea llega del servidor sin el tipo de artículo: se infiere al abrir el formulario. */
export const modeloLineaPedido = (linea: LineaPedido): ModeloLineaPedido => ({
    ...linea,
    tipoArticulo: getTipoArticulo(linea),
});

/** El artículo de una línea recibida o cerrada no se puede cambiar. */
export const articuloLineaBloqueado = (linea: LineaPedido): boolean =>
    linea.cerrada || linea.cantidadRecibida > 0;

export const metaLineaPedido: MetaModelo<ModeloLineaPedido> = {
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
    validacion: articuloDeLineaValido,
};

/** En compras no hay tarifa de proveedor: el coste unitario es obligatorio siempre. */
export const metaNuevaLineaPedido: MetaModelo<NuevaLineaPedido> = {
    campos: {
        referencia: { tipo: "texto" },
        descripcion: { tipo: "texto" },
        cantidad: { requerido: true, tipo: "decimal", decimales: 2 },
        pvpUnitario: { requerido: true, tipo: "moneda", decimales: 2 },
    },
    validacion: articuloDeLineaValido,
};

export const nuevaLineaPedidoVacia = (): NuevaLineaPedido => ({
    tipoArticulo: "registrado",
    referencia: null,
    descripcion: "",
    descripcionArticulo: null,
    cantidad: 1,
    pvpUnitario: 0,
});
