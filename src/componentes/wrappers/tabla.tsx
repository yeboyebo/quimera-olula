import { Entidad } from "../../contextos/comun/diseño.ts";
import { expandirEntidad, formatearClave } from "../detalle/helpers.tsx";
import "./tabla.css";

export type TablaProps = {
  datos: Entidad[];
  seleccionadaId?: string;
  onSeleccion?: (entidad: Entidad) => void;
};

const datosCabecera = (entidad: Entidad) =>
  expandirEntidad(entidad).map(([clave]) => formatearClave(clave));

const cabecera = (entidad: Entidad) =>
  datosCabecera(entidad).map((clave) => (
    <th key={clave} data-modo="columna">
      {clave}
    </th>
  ));

const restoFila = (entidad: Entidad) =>
  expandirEntidad(entidad)
    .filter(([clave]) => clave !== "id")
    .map(([clave, valor]) => (
      <td key={[entidad.id, clave].join("-")}>
        {valor === false ? "No" : valor === true ? "Sí" : valor?.toString()}
      </td>
    ));

export const Tabla = ({ datos, seleccionadaId, onSeleccion }: TablaProps) => {
  return (
    <quimera-tabla>
      <table>
        <thead>
          <tr>{cabecera(datos[0])}</tr>
        </thead>
        <tbody>
          {datos.map((entidad) => (
            <tr
              key={entidad.id}
              onClick={() => onSeleccion && onSeleccion(entidad)}
              data-seleccionada={entidad.id === seleccionadaId}
            >
              <th data-modo="fila">{entidad.id}</th>
              {restoFila(entidad)}
            </tr>
          ))}
        </tbody>
      </table>
    </quimera-tabla>
  );
};
