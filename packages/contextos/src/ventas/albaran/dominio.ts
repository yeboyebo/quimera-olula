import { MetaTabla } from "@olula/componentes/index.js";
import { MetaModelo } from "@olula/lib/dominio.js";
import {
    cambioClienteVentaVacio,
    metaCambioClienteVenta,
    metaLineaVenta,
    metaNuevaLineaVenta,
    metaNuevaVenta,
    metaVenta,
    nuevaLineaVentaVacia,
    nuevaVentaVacia,
    ventaVacia,
} from "../venta/dominio.ts";
import {
    Albaran,
    CambioClienteAlbaran,
    LineaAlbaran,
    NuevaLineaAlbaran,
    NuevoAlbaran,
} from "./diseño.ts";

export const albaranVacio: Albaran = {
    ...ventaVacia,
    servido: "No",
};

export const nuevoAlbaranVacio: NuevoAlbaran = nuevaVentaVacia;

export const cambioClienteAlbaranVacio: CambioClienteAlbaran = cambioClienteVentaVacio;

export const nuevaLineaAlbaranVacia: NuevaLineaAlbaran = nuevaLineaVentaVacia;

export const metaNuevoAlbaran: MetaModelo<NuevoAlbaran> = metaNuevaVenta;

export const metaCambioClienteAlbaran: MetaModelo<CambioClienteAlbaran> = metaCambioClienteVenta;

export const metaAlbaran: MetaModelo<Albaran> = {
    campos: {
        ...metaVenta.campos,
        fecha: { tipo: "fecha", requerido: false },
    },
};

export const metaLineaAlbaran: MetaModelo<LineaAlbaran> = metaLineaVenta;

export const metaNuevaLineaAlbaran: MetaModelo<NuevaLineaAlbaran> = metaNuevaLineaVenta;

export const metaTablaAlbaran: MetaTabla<Albaran> = [
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