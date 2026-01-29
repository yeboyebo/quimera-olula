
import { metaLineaVenta, ventaVacia } from "#/ventas/venta/dominio.ts";
import { MetaModelo } from "@olula/lib/dominio.js";
import {
    LineaFactura,
    VentaTpv
} from "./diseño.ts";

export const ventaTpvVacia: VentaTpv = {
    ...ventaVacia,
    pagado: 0,
    pendiente: 0,
    lineas: [],
    pagos: [],
    puntoVentaId: "",
    puntoVenta: "",
    agenteId: "",
    agente: "",
};

export const metaLineaFactura: MetaModelo<LineaFactura> = metaLineaVenta;

