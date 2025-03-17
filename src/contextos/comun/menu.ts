export interface MenuItemInterface {
  nombre: string;
  url: string;
  icono: string;
  subMenuItems: MenuItemInterface[];
  mostrarDesplegado?: boolean;
}
export const elementosDelMenu: MenuItemInterface[] = [
  { nombre: "Inicio", url: "/", icono: "inicio", subMenuItems: [] },
  {
    nombre: "Facturación",
    url: "#",
    icono: "documentos",
    subMenuItems: [
      {
        nombre: "Clientes",
        url: "/ventas/cliente",
        icono: "",
        subMenuItems: [],
      },
      {
        nombre: "Presupuestos",
        url: "/ventas/presupuesto",
        icono: "",
        subMenuItems: [],
      },
    ],
  },
  { nombre: "Financiera", url: "#", icono: "graficos", subMenuItems: [] },
];
