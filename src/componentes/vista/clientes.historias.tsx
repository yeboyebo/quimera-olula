import { ReactNode } from "react";
import "../../contextos/comun/historias.css";
import { MaestroConDetalleCliente } from "../../contextos/ventas/cliente/vistas/MaestroConDetalleCliente";
import { Historia, MetaHistorias } from "../historias/diseño";
import { Vista } from "./Vista";

// Ahora Home utiliza los props recibidos y los pasa a Vista e Indice
const Clientes = (props: Record<string, unknown>): ReactNode => (
  <Vista {...props}>
    <MaestroConDetalleCliente {...props} />
  </Vista>
);

const meta: MetaHistorias = {
  grupo: "vistas",
  titulo: "Clientes",
  attrs: {},
  Componente: Clientes,
};

export default meta;

export const Base: Historia = {};
