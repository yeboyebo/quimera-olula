import { metaNuevoPedido } from "#/ventas/pedido/crear/dominio.ts";
import { MetaModelo } from "@olula/lib/dominio.js";

export type NuevoPedidoNrj = {
    cliente_id: string;
    direccion_id: string;
    empresa_id: string;
    portes_cliente: boolean;
    transportista_id: string;
};

export const nuevoPedidoNrjVacio: NuevoPedidoNrj = {
    cliente_id: "",
    direccion_id: "",
    empresa_id: "1",
    portes_cliente: false,
    transportista_id: "",
};

export const metaNuevoPedidoNrj: MetaModelo<NuevoPedidoNrj> = {
    campos: {
        ...metaNuevoPedido.campos,
        portes_cliente: { tipo: "checkbox", requerido: false },
        transportista_id: { tipo: "texto", requerido: false },
    },
};