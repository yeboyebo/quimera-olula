import { Entidad } from "../../contextos/comun/diseño.ts";
import "./tabla.css";

export type TablaProps = {
  datos: Entidad[];
  seleccionadaId?: string;
  onSeleccion?: (entidad: Entidad) => void;
};

const filtroSoloPrimitivas = ([, valor]: [string, unknown]) =>
  !Array.isArray(valor) && valor?.constructor !== Object;

const cabeceras = (datosCabecera: string[]) =>
  datosCabecera
    .map((clave) => clave.replaceAll("_", " "))
    .map((clave) => (
      <th key={clave} data-modo="columna">
        {clave}
      </th>
    ));

const restoFila = (entidad: Entidad) =>
  Object.entries(entidad)
    .filter(filtroSoloPrimitivas)
    .filter(([clave]) => clave !== "id")
    .map(([clave, valor]) => (
      <td key={[entidad.id, clave].join("-")}>
        {valor === false ? "No" : valor === true ? "Sí" : valor?.toString()}
      </td>
    ));

export const Tabla = ({ datos, seleccionadaId, onSeleccion }: TablaProps) => {
  const datosCabecera = Object.entries(datos[0])
    .filter(filtroSoloPrimitivas)
    .map(([clave]) => clave);

  return (
    <quimera-tabla>
      <table>
        <thead>
          <tr>{cabeceras(datosCabecera)}</tr>
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
