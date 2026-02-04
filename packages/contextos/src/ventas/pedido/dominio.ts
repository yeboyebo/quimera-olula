import { MetaTabla } from "@olula/componentes/index.js";
import { Direccion } from "@olula/lib/diseño.js";
import { CambioClientePedido, NuevoPedido, Pedido } from "./diseño.ts";

export const metaTablaPedido: MetaTabla<Pedido> = [
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

export const direccionVacia = (): Direccion => ({
    nombre_via: "",
    tipo_via: "",
    numero: "",
    otros: "",
    cod_postal: "",
    ciudad: "",
    provincia_id: 0,
    provincia: "",
    pais_id: "",
    apartado: "",
    telefono: "",
});

export const nuevoClienteRegistradoVacio: NuevoPedido = {
    cliente_id: "",
    direccion_id: "",
    empresa_id: "1",
} as NuevoPedido;

export const cambioClienteVacio = (): CambioClientePedido => ({
    cliente_id: "",
    direccion_id: "",
});

export const cambioCliente = (pedido: Pedido): CambioClientePedido => ({
    cliente_id: pedido.cliente_id,
    direccion_id: pedido.direccion_id,
});


