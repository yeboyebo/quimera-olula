import { nuevaVentaVacia } from "#/ventas/venta/dominio.ts";
import { MetaModelo } from "@olula/lib/dominio.ts";
import { NuevaFactura } from "../diseño.ts";

export const metaNuevaFactura: MetaModelo<NuevaFactura> = {
    campos: {
        cliente_id: { requerido: true },
        empresa_id: { requerido: true },
    }
};

export const nuevaFacturaVacia: NuevaFactura = nuevaVentaVacia;
