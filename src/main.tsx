import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { CalendarioEventos } from "./apps/almaeventos/contextos/eventos/calendario_eventos/vistas/CalendarioEventos.tsx";
import { DetalleEvento } from "./apps/almaeventos/contextos/eventos/evento/vistas/DetalleEvento/DetalleEvento.tsx";
import { MaestroEvento } from "./apps/almaeventos/contextos/eventos/evento/vistas/MaestroEvento.tsx";
import { MaestroConDetalleProducto } from "./apps/almaeventos/contextos/eventos/producto/vistas/MaestroConDetalleProducto.tsx";
import { MaestroConDetalleTrabajador } from "./apps/almaeventos/contextos/eventos/trabajador/vistas/MaestroConDetalleTrabajador.tsx";
import { MaestroConDetalleTrabajadorEvento } from "./apps/almaeventos/contextos/eventos/trabajador_evento/vistas/MaestroConDetalleTrabajadorEvento.tsx";
import { Historias } from "./componentes/historias/historias.tsx";
import { Vista } from "./componentes/vista/Vista.tsx";
import { MaestroConDetalleGruposReglas } from "./contextos/administracion/vistas/MaestroConDetalleGruposReglas.tsx";
import { MaestroDetalleTransferenciasStock } from "./contextos/almacen/transferencias/vistas/MaestroDetalleTransferenciasStock.tsx";
import "./contextos/comun/comun.css";
import { Indice } from "./contextos/comun/Indice.tsx";
import { MaestroConDetalleAccion } from "./contextos/crm/accion/vistas/MaestroConDetalleAccion.tsx";
import { MaestroConDetalleClienteCRM } from "./contextos/crm/cliente/vistas/MaestroConDetalleCliente.tsx";
import { MaestroConDetalleContacto } from "./contextos/crm/contacto/vistas/MaestroConDetalleContacto.tsx";
import { MaestroConDetalleEstadoOportunidad } from "./contextos/crm/estadoOportunidadVenta/vistas/MaestroConDetalleEstadoOportunidad.tsx";
import { MaestroConDetalleIncidencia } from "./contextos/crm/incidencia/vistas/MaestroConDetalleIncidencia.tsx";
import { MaestroConDetalleLead } from "./contextos/crm/lead/vistas/MaestroConDetalleLead.tsx";
import { MaestroConDetalleOportunidadVenta } from "./contextos/crm/oportunidadventa/vistas/MaestroConDetalleOportunidadVenta.tsx";
import { Login } from "./contextos/usuarios/login/vistas/Login.tsx";
import { Logout } from "./contextos/usuarios/usuario/vistas/Logout.tsx";
import Perfil from "./contextos/usuarios/usuario/vistas/Perfil.tsx";
import { MaestroConDetalleAlbaran } from "./contextos/ventas/albaran/vistas/MaestroConDetalleAlbaran.tsx";
import { MaestroConDetalleCliente } from "./contextos/ventas/cliente/vistas/MaestroConDetalleCliente.tsx";
import { MaestroConDetalleFactura } from "./contextos/ventas/factura/vistas/MaestroConDetalleFactura.tsx";
import { MaestroConDetallePedido } from "./contextos/ventas/pedido/vistas/MaestroConDetallePedido.tsx";
import { MaestroConDetallePresupuesto } from "./contextos/ventas/presupuesto/vistas/MaestroConDetallePresupuesto.tsx";
import "./index.css";

const rutas = createBrowserRouter([
  {
    path: "/",
    Component: Vista,
    children: [
      { index: true, Component: Indice },
      {
        path: "ventas",
        children: [
          { path: "cliente", Component: MaestroConDetalleCliente },
          { path: "presupuesto", Component: MaestroConDetallePresupuesto },
          { path: "pedido", Component: MaestroConDetallePedido },
          { path: "albaran", Component: MaestroConDetalleAlbaran },
          { path: "factura", Component: MaestroConDetalleFactura },
        ],
      },
      {
        path: "crm",
        children: [
          {
            path: "oportunidadventa",
            Component: MaestroConDetalleOportunidadVenta,
          },
          {
            path: "estadooportunidadventa",
            Component: MaestroConDetalleEstadoOportunidad,
          },
          { path: "cliente", Component: MaestroConDetalleClienteCRM },
          { path: "contacto", Component: MaestroConDetalleContacto },
          { path: "accion", Component: MaestroConDetalleAccion },
          { path: "lead", Component: MaestroConDetalleLead },
          { path: "incidencia", Component: MaestroConDetalleIncidencia },
        ],
      },
      {
        path: "almacen",
        children: [
          {
            path: "transferencias",
            Component: MaestroDetalleTransferenciasStock,
          },
        ],
      },
      { path: "login", Component: Login },
      { path: "logout", Component: Logout },
      { path: "usuario/perfil", Component: Perfil },
      {
        path: "administracion/grupos",
        Component: MaestroConDetalleGruposReglas,
      },
      { path: "docs/componentes", Component: Historias },
      {
        path: "eventos",
        children: [
          { path: "calendario", Component: CalendarioEventos },
          { path: "eventos", Component: MaestroEvento },
          { path: "evento/:id", Component: DetalleEvento },
          { path: "producto", Component: MaestroConDetalleProducto },
          { path: "trabajador", Component: MaestroConDetalleTrabajador },
          {
            path: "trabajador_evento",
            Component: MaestroConDetalleTrabajadorEvento,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={rutas} />
  </StrictMode>
);
