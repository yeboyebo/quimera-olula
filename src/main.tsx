import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { Vista } from "./componentes/vista/Vista.tsx";
import { Indice } from "./contextos/comun/Indice.tsx";
import { DetalleCliente } from "./contextos/ventas/cliente/vistas/DetalleCliente.tsx";
import { MaestroConDetalleCliente } from "./contextos/ventas/cliente/vistas/MaestroConDetalleCliente.tsx";
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
                  <DetalleCliente/>
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
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
