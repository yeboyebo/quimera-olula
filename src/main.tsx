import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouteObject, RouterProvider } from "react-router";
import { Vista } from "./componentes/vista/Vista.tsx";
import "./contextos/comun/comun.css";
import "./index.css";
import { routerFactory } from "./router.ts";

const routers: RouteObject[] = routerFactory();

const rutas = createBrowserRouter([
  {
    path: "/",
    Component: Vista,
    children: routers,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={rutas} />
  </StrictMode>
);
