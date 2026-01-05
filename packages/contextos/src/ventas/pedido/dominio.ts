import { MetaTabla } from "@olula/componentes/index.js";
import { MetaModelo, modeloEsEditable, modeloEsValido } from "@olula/lib/dominio.ts";
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
        fecha: { tipo: "fecha", requerido: false },
    },
    editable: (pedido: Pedido, _?: string) => {
        return !pedido.aprobado;
    },
};

export const editable = modeloEsEditable<Pedido>(metaPedido);
export const pedidoValido = modeloEsValido<Pedido>(metaPedido);

export const metaLineaPedido: MetaModelo<LineaPedido> = metaLineaVenta;

export const metaNuevaLineaPedido: MetaModelo<NuevaLineaPedido> = metaNuevaLineaVenta;


export const metaTablaPedido: MetaTabla<Pedido> = [
    {
        id: "codigo",
        cabecera: "Código",
    },
    {
        id: "nombre_cliente",
        cabecera: "Cliente",
    },
    // {
    //     id: "servido",
    //     cabecera: "Servido",
    // },
    {
        id: "total",
        cabecera: "Total",
        tipo: "moneda",
    },

];

