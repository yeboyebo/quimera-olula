import { Maestro } from "../../../../componentes/maestro/Maestro.tsx";
import { SubVista } from "../../../../componentes/vista/Vista.tsx";
import {
  accionesDirCliente,
} from "../infraestructura.ts";
import { MaestroDireccionesAcciones } from "./MaestroDireccionesAcciones.tsx";

export type MaestroProps = {
  id?: string;
};

export const MaestroDirecciones = ({ id }: MaestroProps) => {
  if (!id) {
    return null;
  }

  const acciones = {
    obtenerTodos: async () => accionesDirCliente.obtenerTodos(id),
    obtenerUno: accionesDirCliente.obtenerUno(id),
    crearUno: accionesDirCliente.crearUno(id),
    actualizarUno: accionesDirCliente.actualizarUno(id),
    eliminarUno: accionesDirCliente.eliminarUno(id),
    marcarFacturacion: accionesDirCliente.marcarFacturacion(id),
  };

  return <SubVista>
      <Maestro Acciones={MaestroDireccionesAcciones} acciones={acciones} />;
    </SubVista>;
};
