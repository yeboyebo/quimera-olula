export const otrosMenu = [
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
    {
        nombre: "Almacén",
        icono: "almacen",
        subelementos: [
            {
                nombre: "Transferencias de Stock",
                url: "/almacen/transferencias",
                icono: "",
            },
        ],
    },
    {
        nombre: "Eventos",
        icono: "fichero",
        subelementos: [
            {
                nombre: "Calendario",
                url: "/eventos/calendario",
                icono: "",
            },
            {
                nombre: "Productos",
                url: "/eventos/producto",
                icono: "",
            },
            {
                nombre: "Eventos",
                url: "/eventos/eventos",
                icono: "",
            },
            {
                nombre: "Trabajadores",
                url: "/eventos/trabajador",
                icono: "",
            },
            {
                nombre: "Trabajadores por evento",
                url: "/eventos/trabajador_evento",
                icono: "",
            }
        ]
    }
]

