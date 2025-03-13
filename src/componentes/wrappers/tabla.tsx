import { Entidad } from "../../contextos/comun/diseño.ts";
import "./tabla.css";

export type TablaProps = {
  datos: Entidad[];
  seleccionadaId?: string;
  onSeleccion?: (entidad: Entidad) => void;
};

const cabecera = (entidad: Entidad) =>
  Object.entries(entidad)
    .filter(([, valor]) => !Array.isArray(valor))
    .flatMap(([clave, valor]) =>
      valor?.constructor !== Object ? [clave] : Object.keys(valor)
    )
    .map((clave) => clave.replaceAll("_", " "))
    .map((clave) => (
      <th key={clave} data-modo="columna">
        {clave}
      </th>
    ));

const restoFila = (entidad: Entidad) =>
  Object.entries(entidad)
    .filter(([clave, valor]) => clave !== "id" && !Array.isArray(valor))
    .flatMap(([clave, valor]) => {
      if (valor?.constructor !== Object) return [[clave, valor]];

      return Object.entries(valor).map(([claveInterna, valor]) => [
        clave + "." + claveInterna,
        valor,
      ]);
    })
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
