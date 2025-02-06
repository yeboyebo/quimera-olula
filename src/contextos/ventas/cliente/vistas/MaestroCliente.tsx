import { Master } from "../../../../componentes/Master.tsx";
import { accionesCliente } from "../infraestructura.ts";

export const MaestroCliente = () => {
  return <Master acciones={accionesCliente} />;
};
