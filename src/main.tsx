import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { Indice } from "./contextos/comun/Indice.tsx";
import { DetalleCliente } from "./contextos/ventas/cliente/vistas/DetalleCliente.tsx";
import { MaestroCliente } from "./contextos/ventas/cliente/vistas/MaestroCliente.tsx";
import { MaestroConDetalleCliente } from "./contextos/ventas/cliente/vistas/MaestroConDetalleCliente.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<Indice />} />
        <Route path="ventas">
          <Route path="cliente">
            <Route index element={<MaestroConDetalleCliente />} />
            <Route path="maestro" element={<MaestroCliente />} />
            <Route path=":id" element={<DetalleCliente />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
