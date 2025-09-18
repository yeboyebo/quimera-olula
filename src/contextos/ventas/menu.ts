import { ElementoMenu } from "../../componentes/menu/menu.ts";

export const menuVentas: ElementoMenu[] = [{
    nombre: "Ventas",
    icono: "fichero",
    subelementos: [
        {
            nombre: "Clientes",
            url: "/ventas/cliente",
            regla: "crm.cliente.leer",
            icono: "",
        },
        {
            nombre: "Presupuestos",
            url: "/ventas/presupuesto",
            regla: "ventas.presupuesto.leer",
            icono: "",
        },
        {
            nombre: "Pedidos",
            url: "/ventas/pedido",
            regla: "ventas.pedido.leer",
            icono: "",
        },
        {
            nombre: "Albaranes",
            url: "/ventas/albaran",
            regla: "ventas.presupuesto.leer",
            icono: "",
        },
        {
            nombre: "Facturas",
            url: "/ventas/factura",
            regla: "ventas.factura.leer",
            icono: "",
        },
    ],
},]