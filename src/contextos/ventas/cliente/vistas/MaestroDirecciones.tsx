import { Maestro } from "../../../../componentes/maestro/Maestro.tsx";
import { SubVista } from "../../../../componentes/vista/Vista.tsx";
import { DireccionCliente } from "../diseño.ts";
import {
  crearDireccionCliente,
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
    obtenerUno: async () => ({} as DireccionCliente),
    crearUno: async () => ({} as DireccionCliente),
    actualizarUno: async () => {},
    eliminarUno: async () => {},
    crearDireccion: crearDireccionCliente(id),
  };

  return <SubVista>
      <Maestro Acciones={MaestroDireccionesAcciones} acciones={acciones} />;
    </SubVista>;
};
