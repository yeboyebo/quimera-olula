import { Maestro } from "../../../../componentes/maestro/Maestro.tsx";
import { accionesCliente } from "../infraestructura.ts";

export const MaestroCliente = () => {
  return <Maestro acciones={accionesCliente} />;
};
