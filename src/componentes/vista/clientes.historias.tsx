import "../../contextos/comun/historias.css";
import { MaestroConDetalleCliente } from "../../contextos/ventas/cliente/vistas/MaestroConDetalleCliente";
import { Historia, MetaHistorias } from "../historias/diseño";
import { Vista } from "./Vista";

const meta: MetaHistorias = {
  grupo: "vistas",
  titulo: "Clientes",
  attrs: {},
  Componente: (props) => (
    <Vista {...props}>
      <MaestroConDetalleCliente {...props} />
    </Vista>
  ),
};

export default meta;

export const Base: Historia = {};
