export interface ElementoMenuPadre {
  nombre: string;
  icono?: string;
  subelementos: ElementoMenu[];
}

export interface ElementoMenuHijo {
  nombre: string;
  icono?: string;
  url: string;
}

export type ElementoMenu = ElementoMenuPadre | ElementoMenuHijo;

export const elementosDelMenu: ElementoMenu[] = [
  { nombre: "Inicio", url: "/", icono: "inicio" },
  {
    nombre: "Ventas",
    icono: "fichero",
    subelementos: [
      {
        nombre: "Clientes",
        url: "/ventas/cliente",
        icono: "",
      },
      {
        nombre: "Presupuestos",
        url: "/ventas/presupuesto",
        icono: "",
      },
      {
        nombre: "Pedidos",
        url: "/ventas/pedido",
        icono: "",
      },
      {
        nombre: "Albaranes",
        url: "/ventas/albaran",
        icono: "",
      },
      {
        nombre: "Facturas",
        url: "/ventas/factura",
        icono: "",
      },
    ],
  },
  {
    nombre: "CRM",
    icono: "fichero",
    subelementos: [
      {
        nombre: "Oportunidades de venta",
        url: "/crm/oportunidadventa",
        icono: "",
      },
      {
        nombre: "Estados por oportunidad de venta",
        url: "/crm/estadooportunidadventa",
        icono: "",
      },
      {
        nombre: "Clientes",
        url: "/crm/cliente",
        icono: "",
      },
      {
        nombre: "Contactos",
        url: "/crm/contacto",
        icono: "",
      },
      {
        nombre: "Acciones",
        url: "/crm/accion",
        icono: "",
      },
      {
        nombre: "Leads",
        url: "/crm/lead",
        icono: "",
      },
    ],
  },
  // {
  //   nombre: "Financiera", icono: "grafico_barras", subelementos: [{
  //     nombre: "Cuentas",
  //     url: "/financiera/cuenta",
  //     icono: "",
  //   }]
  // },
  {
    nombre: "Eventos",
    icono: "fichero",
    subelementos: [
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
];
