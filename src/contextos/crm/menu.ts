export const menuCrm = [
    {
        nombre: "CRM",
        icono: "fichero",
        subelementos: [
            {
                nombre: "Oportunidades de venta",
                url: "/crm/oportunidadventa",
                regla: "crm.oportunidad_venta.leer",
                icono: "",
            },
            {
                nombre: "Estados por oportunidad de venta",
                url: "/crm/estadooportunidadventa",
                regla: "crm.estado_oportunidad_venta.leer",
                icono: "",
            },
            {
                nombre: "Clientes",
                url: "/crm/cliente",
                regla: "crm.cliente.leer",
                icono: "",
            },
            {
                nombre: "Contactos",
                url: "/crm/contacto",
                regla: "crm.contacto.leer",
                icono: "",
            },
            {
                nombre: "Acciones",
                url: "/crm/accion",
                regla: "crm.accion.leer",
                icono: "",
            },
            {
                nombre: "Leads",
                url: "/crm/lead",
                regla: "crm.lead.leer",
                icono: "",
            },
            {
                nombre: "Incidencias",
                url: "/crm/incidencia",
                regla: "crm.incidencia.leer",
                icono: "",
            },
        ],
    },
]