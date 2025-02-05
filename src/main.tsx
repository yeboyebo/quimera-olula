import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { Clientes } from "./contextos/ventas/clientes/Clientes.tsx";
import { Cliente } from "./contextos/ventas/cliente/Cliente.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<Clientes />} />
        <Route path="cliente/:id" element={<Cliente />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
