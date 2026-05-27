// Libreria Iconos: https://v2.boxicons.com/cheatsheet
// Fichero iconos: packages/componentes/src/atomos/qicono.tsx

export const menuVentas = {
    // ********** Sección PLanificador **********
    "Planificador Semanal": { icono: "calendario_vacio_relleno", posicion: 2 },
    "Planificador Semanal/Planificador Semanal": {
        url: "/planificador_semanal",
        regla: "PlanificadorSemanal:visit",
        icono: "calendario_relleno",
    },
    "Planificador Semanal/Resumen Planificador": {
        url: "/planificador_semanal_resumen",
        regla: "PlanificadorSemanalResumen:visit",
        icono: "detalle_relleno",
    },
    "Planificador Semanal/Resumen Agente": {
        url: "/resumen_semanal",
        icono: "usuario_detalle_relleno",
    },
    "Planificador Semanal/Control Horario": {
        url: "/control_horario",
        icono: "tiempo_relleno",
    },
    // ********** Sección Pedidos **********
    "Pedidos": { icono: "tienda_relleno", posicion: 3 },
    "Pedidos/Preparación Pedidos Web": {
        url: "/pedidos_web",
        icono: "bolsa_relleno",
    },
    "Pedidos/Nuevo Pedido": {
        url: "/new_pedido",
        icono: "carrito_relleno",
    },
};
