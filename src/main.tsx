import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { Historias } from "./componentes/historias/historias.tsx";
import { Vista } from "./componentes/vista/Vista.tsx";
import { MaestroConDetalleGruposReglas } from "./contextos/administracion/vistas/MaestroConDetalleGruposReglas.tsx";
import "./contextos/comun/comun.css";
import { Indice } from "./contextos/comun/Indice.tsx";
import { LoginPage } from "./contextos/usuarios/login/vistas/LoginPage.tsx";
import { MaestroConDetalleAlbaran } from "./contextos/ventas/albaran/vistas/MaestroConDetalleAlbaran.tsx";
import { DetalleCliente } from "./contextos/ventas/cliente/vistas/DetalleCliente/DetalleCliente.tsx";
import { MaestroConDetalleCliente } from "./contextos/ventas/cliente/vistas/MaestroConDetalleCliente.tsx";
import { MaestroConDetalleFactura } from "./contextos/ventas/factura/vistas/MaestroConDetalleFactura.tsx";
import { MaestroConDetallePedido } from "./contextos/ventas/pedido/vistas/MaestroConDetallePedido.tsx";
import { MaestroConDetallePresupuesto } from "./contextos/ventas/presupuesto/vistas/MaestroConDetallePresupuesto.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          index
          element={
            <Vista>
              <Indice />
            </Vista>
          }
        />
        <Route path="ventas">
          <Route path="cliente">
            <Route
              index
              element={
                <Vista>
                  <MaestroConDetalleCliente />
                </Vista>
              }
            />
            <Route
              path=":id"
              element={
                <Vista>
                  <DetalleCliente />
                </Vista>
              }
            />
          </Route>
          <Route path="pedido">
            <Route
              index
              element={
                <Vista>
                  <MaestroConDetallePedido />
                </Vista>
              }
            />
          </Route>
          <Route path="presupuesto">
            <Route
              index
              element={
                <Vista>
                  <MaestroConDetallePresupuesto />
                </Vista>
              }
            />
            import("./componentes/historias/historias.tsx")
          </Route>
          <Route path="albaran">
            <Route
              index
              element={
                <Vista>
                  <MaestroConDetalleAlbaran />
                </Vista>
              }
            />
          </Route>
          <Route path="factura">
            <Route
              index
              element={
                <Vista>
                  <MaestroConDetalleFactura />
                </Vista>
              }
            />
          </Route>
        </Route>
        <Route path="login">
          <Route
            index
            element={
              <Vista>
                <LoginPage />
              </Vista>
            }
          />
        </Route>
        <Route path="administracion">
          <Route path="grupos">
            <Route
              index
              element={
                <Vista>
                  <MaestroConDetalleGruposReglas />
                </Vista>
              }
            />
          </Route>
        </Route>
        <Route path="docs/componentes" element={<Historias />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
