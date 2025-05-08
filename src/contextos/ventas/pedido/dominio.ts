import { MetaModelo } from "../../comun/dominio.ts";
import {
    cambioClienteVentaVacio,
    metaCambioClienteVenta,
    metaLineaVenta,
    metaNuevaLineaVenta,
    metaNuevaVenta,
    metaVenta,
    nuevaLineaVentaVacia,
    nuevaVentaVacia,
    ventaVacia
} from "../venta/dominio.ts";
import {
    CambioClientePedido,
    LineaPedido,
    NuevaLineaPedido,
    NuevoPedido,
    Pedido
} from "./diseño.ts";


export const pedidoVacio: Pedido = {
    ...ventaVacia,
    servido: 'No',
}

export const nuevoPedidoVacio: NuevoPedido = nuevaVentaVacia;

export const cambioClientePedidoVacio: CambioClientePedido = cambioClienteVentaVacio;

export const nuevaLineaPedidoVacia: NuevaLineaPedido = nuevaLineaVentaVacia;

export const metaNuevoPedido: MetaModelo<NuevoPedido> = metaNuevaVenta;

export const metaCambioClientePedido: MetaModelo<CambioClientePedido> = metaCambioClienteVenta;

export const metaPedido: MetaModelo<Pedido> = {
    campos: {
        ...metaVenta.campos,
    },

};


export const metaLineaPedido: MetaModelo<LineaPedido> = metaLineaVenta;

export const metaNuevaLineaPedido: MetaModelo<NuevaLineaPedido> = metaNuevaLineaVenta;




