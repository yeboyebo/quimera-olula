import { MetaTabla } from "@olula/componentes/index.js";
import {
    cambioClienteVentaVacio,
    nuevaVentaVacia,
    ventaVacia
} from "../venta/dominio.ts";
import {
    CambioClienteFactura,
    Factura,
    NuevaFactura
} from "./diseño.ts";

export const metaTablaFactura: MetaTabla<Factura> = [
    {
        id: "codigo",
        cabecera: "Código",
    },
    {
        id: "nombre_cliente",
        cabecera: "Cliente",
    },
    {
        id: "total",
        cabecera: "Total",
        tipo: "moneda",
    },
];

export const facturaVacia = (): Factura => ({
    ...ventaVacia,
    editable: false,
});

export const nuevaFacturaVacia: NuevaFactura = nuevaVentaVacia;

export const cambioClienteFacturaVacio: CambioClienteFactura = cambioClienteVentaVacio;

