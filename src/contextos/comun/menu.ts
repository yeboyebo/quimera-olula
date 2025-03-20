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
  { nombre: "Inicio", url: "/", icono: "home" },
  {
    nombre: "Ventas",
    icono: "file",
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
    ],
  },
  {
    nombre: "Financiera", icono: "bar-chart-alt-2", subelementos: [{
      nombre: "Cuentas",
      url: "/financiera/cuenta",
      icono: "",
    }]
  },
];
