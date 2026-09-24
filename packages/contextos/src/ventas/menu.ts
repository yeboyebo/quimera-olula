export const menuVentas = {
    "Ventas": { icono: "fichero" },
    "Ventas/Clientes": { url: "/ventas/cliente", regla: "ventas.cliente.leer" },
    "Ventas/Presupuestos": { url: "/ventas/presupuesto", regla: "ventas.presupuesto.leer" },
    "Ventas/Pedidos": {
        url: "/ventas/pedido",
        regla: "ventas.pedido.leer",
        descripcionIA: "Gestiona pedidos de venta: crear un pedido nuevo para un cliente con líneas de artículos, consultar o modificar pedidos existentes.",
        // Cada parámetro llega a la URL y el maestro lo aplica como filtro de
        // pedidoscli: solo valen campos de la cabecera (ver dict_criteria del backend).
        parametrosIA: {
            id: "id del pedido para consultar el pedido",
        },
    },
    "Ventas/Albaranes": { url: "/ventas/albaran", regla: "ventas.albaran.leer" },
    "Ventas/Facturas": { url: "/ventas/factura", regla: "ventas.factura.leer" },
    "Ventas/Artículos": { url: "/ventas/articulo", regla: "ventas.articulo" },
    "Ventas/Tarifas": { url: "/ventas/tarifa", regla: "ventas.tarifa.leer" },
};