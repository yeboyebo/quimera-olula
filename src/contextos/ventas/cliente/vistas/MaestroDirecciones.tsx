import { CampoFormularioGenerico } from "../../../../componentes/detalle/FormularioGenerico.tsx";
import { Maestro } from "../../../../componentes/maestro/Maestro.tsx";
import { SubVista } from "../../../../componentes/vista/Vista.tsx";
import { accionesDirCliente } from "../infraestructura.ts";
import { MaestroDireccionesAcciones } from "./MaestroDireccionesAcciones.tsx";

export type MaestroProps = {
  id?: string;
};

const camposDireccion: CampoFormularioGenerico[] = [
  { nombre: "id", etiqueta: "ID", tipo: "text", oculto: true },
  { nombre: "nombre_via", etiqueta: "Nombre de la Vía", tipo: "text" },
  { nombre: "tipo_via", etiqueta: "Tipo de Vía", tipo: "text" },
  { nombre: "numero", etiqueta: "Número", tipo: "text" },
  { nombre: "otros", etiqueta: "Otros", tipo: "text" },
  { nombre: "cod_postal", etiqueta: "Código Postal", tipo: "text" },
  { nombre: "ciudad", etiqueta: "Ciudad", tipo: "text" },
  { nombre: "provincia_id", etiqueta: "ID de Provincia", tipo: "number" },
  { nombre: "provincia", etiqueta: "Provincia", tipo: "text" },
  { nombre: "pais_id", etiqueta: "ID de País", tipo: "text" },
  { nombre: "apartado", etiqueta: "Apartado", tipo: "text" },
  { nombre: "telefono", etiqueta: "Teléfono", tipo: "text" },
];

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

  return (
    <SubVista>
      <Maestro
        Acciones={MaestroDireccionesAcciones}
        acciones={acciones}
        camposEntidad={camposDireccion}
      />
    </SubVista>
  );
};
