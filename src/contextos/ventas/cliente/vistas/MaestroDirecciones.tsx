import { Maestro } from "../../../../componentes/maestro/Maestro.tsx";
import { SubVista } from "../../../../componentes/vista/Vista.tsx";
import { DireccionCliente } from "../diseño.ts";
import {
  cambiarDireccionCliente,
  crearDireccionCliente,
  obtenerDireccionCliente,
  obtenerDireccionesCliente,
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
    obtenerTodos: async () => obtenerDireccionesCliente(id),
    obtenerUno: obtenerDireccionCliente(id),
    crearUno: async () => ({} as DireccionCliente),
    actualizarUno: async () => {},
    eliminarUno: async () => {},
    crearDireccion: crearDireccionCliente(id),
    cambiarDireccion: cambiarDireccionCliente(id),
  };

  return <SubVista>
      <Maestro Acciones={MaestroDireccionesAcciones} acciones={acciones} />;
    </SubVista>;
};
