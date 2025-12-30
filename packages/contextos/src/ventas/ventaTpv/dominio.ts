import { MetaTabla } from "@olula/componentes/index.js";
import { MetaModelo } from "@olula/lib/dominio.ts";
import { Factura } from "../factura/diseño.ts";
import {
    cambioClienteVentaVacio,
    metaCambioClienteVenta,
    metaLineaVenta,
    metaNuevaLineaVenta,
    metaNuevoPagoEfecctivo,
    metaVenta,
    nuevaLineaVentaVacia,
    ventaVacia
} from "../venta/dominio.ts";
import {
    CambioClienteFactura,
    LineaFactura,
    NuevaLineaFactura,
    NuevoPagoEfectivo,
    VentaTpv
} from "./diseño.ts";

export const ventaTpvVacia: VentaTpv = {
    ...ventaVacia,
    pagado: 0,
    pendiente: 0,
};

export const nuevoPagoEfectivoVacio: NuevoPagoEfectivo = {
    importe: 0
}


export const cambioClienteFacturaVacio: CambioClienteFactura = cambioClienteVentaVacio;

export const nuevaLineaFacturaVacia: NuevaLineaFactura = nuevaLineaVentaVacia;

export const metaCambioClienteFactura: MetaModelo<CambioClienteFactura> = metaCambioClienteVenta;

export const metaVentaTpv: MetaModelo<VentaTpv> = {
    campos: {
        fecha: { tipo: "fecha", requerido: false },
        ...metaVenta.campos,
    },
};

export const metaLineaFactura: MetaModelo<LineaFactura> = metaLineaVenta;

export const metaNuevaLineaFactura: MetaModelo<NuevaLineaFactura> = metaNuevaLineaVenta;

export const metaNuevoPagoEfectivo: MetaModelo<NuevoPagoEfectivo> = metaNuevoPagoEfecctivo;


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

