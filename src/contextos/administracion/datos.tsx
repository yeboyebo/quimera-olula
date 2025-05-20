import { Grupo, Regla } from "./diseño.ts";

export const grupos: Grupo[] = [
  {
    id: "Administracion",
    descripcion: "Administadores",
  },
  {
    id: "Almacen",
    descripcion: "Almacen",
  },
  {
    id: "calidad",
    descripcion: "Responsable de calidad",
  },
  {
    id: "gerentes",
    descripcion: "Gerentes",
  },
  {
    id: "MKT",
    descripcion: "Marketing",
  },
  {
    id: "Oficina",
    descripcion: "Oficinas",
  },
];

export const rules: Regla[] = [
  {
    id: "general",
    descripcion: "Acceso General",
    grupo: "general",
  },
  {
    id: "pedidoscli",
    grupo: "pedidoscli",
    descripcion: "Pedidos de cliente",
  },
  {
    id: "pedidoscli/get",
    grupo: "pedidoscli",
    descripcion: "Puede recibir pedidos de cliente",
  },
  {
    id: "pedidoscli/post",
    grupo: "pedidoscli",
    descripcion: "Puede crear pedidos de cliente",
  },
  {
    id: "pedidoscli/patch",
    grupo: "pedidoscli",
    descripcion: "Puede modificar pedidos de cliente",
  },
  {
    id: "pedidoscli/delete",
    grupo: "pedidoscli",
    descripcion: "Puede eliminar pedidos de cliente",
  },
  {
    id: "albaranescli",
    grupo: "albaranescli",
    descripcion: "Albaranes de cliente",
  },
  {
    id: "albaranescli/get",
    grupo: "albaranescli",
    descripcion: "Puede recibir albaranes de cliente",
  },
  {
    id: "albaranescli/post",
    grupo: "albaranescli",
    descripcion: "Puede crear albaranes de cliente",
  },
  {
    id: "albaranescli/patch",
    grupo: "albaranescli",
    descripcion: "Puede modificar albaranes de cliente",
  },
  {
    id: "albaranescli/delete",
    grupo: "albaranescli",
    descripcion: "Puede eliminar albaranes de cliente",
  },
  {
    id: "facturascli",
    grupo: "facturascli",
    descripcion: "Facturas de cliente",
  },
  {
    id: "facturascli/get",
    grupo: "facturascli",
    descripcion: "Puede recibir facturas de cliente",
  },
  {
    id: "facturascli/post",
    grupo: "facturascli",
    descripcion: "Puede crear facturas de cliente",
  },
  {
    id: "facturascli/patch",
    grupo: "facturascli",
    descripcion: "Puede modificar facturas de cliente",
  },
  {
    id: "facturascli/delete",
    grupo: "facturascli",
    descripcion: "Puede eliminar facturas de cliente",
  },
  {
    id: "presupuestoscli",
    grupo: "presupuestoscli",
    descripcion: "Presupuestos de cliente",
  },
  {
    id: "presupuestoscli/get",
    grupo: "presupuestoscli",
    descripcion: "Puede recibir presupuestos de cliente",
  },
  {
    id: "presupuestoscli/post",
    grupo: "presupuestoscli",
    descripcion: "Puede crear presupuestos de cliente",
  },
  {
    id: "presupuestoscli/patch",
    grupo: "presupuestoscli",
    descripcion: "Puede modificar presupuestos de cliente",
  },
  {
    id: "presupuestoscli/delete",
    grupo: "presupuestoscli",
    descripcion: "Puede eliminar presupuestos de cliente",
  },
  {
    id: "pedidoscli/accion1",
    grupo: "pedidoscli",
    descripcion:
      "Puede ejecutar la accion 1 de pedidos de cliente. Puede ejecutar la accion 1 de pedidos de cliente.",
  },
  {
    id: "pedidoscli/accion2",
    grupo: "pedidoscli",
    descripcion: "Puede ejecutar la accion 2 de pedidos de cliente",
  },
  {
    id: "articulos",
    grupo: "articulos",
    descripcion: "articulos",
  },
  {
    id: "articulos/get",
    grupo: "articulos",
    descripcion: "Puede recibir articulos",
  },
  {
    id: "articulos/post",
    grupo: "articulos",
    descripcion: "Puede crear articulos",
  },
  {
    id: "articulos/patch",
    grupo: "articulos",
    descripcion: "Puede modificar articulos",
  },
  {
    id: "articulos/delete",
    grupo: "articulos",
    descripcion: "Puede eliminar articulos",
  },
  {
    id: "stocks",
    grupo: "stocks",
    descripcion: "Stocks",
  },
  {
    id: "stocks/get",
    grupo: "stocks",
    descripcion: "Puede recibir stocks",
  },
  {
    id: "stocks/post",
    grupo: "stocks",
    descripcion: "Puede crear stocks",
  },
  {
    id: "stocks/patch",
    grupo: "stocks",
    descripcion: "Puede modificar stocks",
  },
  {
    id: "stocks/delete",
    grupo: "stocks",
    descripcion: "Puede eliminar stocks",
  },
  {
    id: "inventarios",
    grupo: "inventarios",
    descripcion: "Inventarios",
  },
  {
    id: "clientes",
    grupo: "clientes",
    descripcion: "Clientes",
  },
  {
    id: "clientes/get",
    grupo: "clientes",
    descripcion: "Puede recibir clientes",
  },
  {
    id: "clientes/post",
    grupo: "clientes",
    descripcion: "Puede crear clientes",
  },
  {
    id: "clientes/patch",
    grupo: "clientes",
    descripcion: "Puede modificar clientes",
  },
  {
    id: "clientes/delete",
    grupo: "clientes",
    descripcion: "Puede eliminar clientes",
  },
  {
    id: "contactos",
    grupo: "contactos",
    descripcion: "Contactos",
  },
  {
    id: "contactos/get",
    grupo: "contactos",
    descripcion: "Puede recibir contactos",
  },
  {
    id: "contactos/post",
    grupo: "contactos",
    descripcion: "Puede crear contactos",
  },
  {
    id: "contactos/patch",
    grupo: "contactos",
    descripcion: "Puede modificar contactos",
  },
  {
    id: "contactos/delete",
    grupo: "contactos",
    descripcion: "Puede eliminar contactos",
  },
];

export const permisos = [
  {
    idpermission: 3,
    idrule: "albaranescli/delete",
    id: "almacen",
    value: false,
  },
  {
    idpermission: 59,
    idrule: "presupuestoscli",
    id: "almacen",
    value: true,
  },
  {
    idpermission: 60,
    idrule: "presupuestoscli",
    id: "administracion",
    value: false,
  },
  {
    idpermission: 61,
    idrule: "presupuestoscli/delete",
    id: "almacen",
    value: false,
  },
];
