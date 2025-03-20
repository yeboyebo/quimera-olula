import { Entidad, Orden } from "../../contextos/comun/diseño.ts";
import { expandirEntidad } from "../detalle/helpers.tsx";
import "./tabla.css";

const cabecera = (
  cabeceras: Record<string, string>,
  orden: Orden,
  onOrdenar?: (clave: string) => void
) => {
  return Object.keys(cabeceras).map((clave) => (
    <th
      key={clave}
      data-modo="columna"
      data-orden={orden[cabeceras[clave]] ?? ""}
      onClick={() => onOrdenar && onOrdenar(cabeceras[clave])}
    >
      {clave}
    </th>
  ));
};

const fila = (entidad: Entidad) => {
  const [[clave, valor], ...resto] = expandirEntidad(entidad);

  return [
    <th key={[entidad.id, clave].join("-")} data-modo="fila">
      {valor}
    </th>,
    ...resto.map(([clave, valor]) => (
      <td key={[entidad.id, clave].join("-")}>
        {valor === false ? "No" : valor === true ? "Sí" : valor?.toString()}
      </td>
    )),
  ];
};

export type TablaProps = {
  cabeceras: Record<string, string>;
  datos: Entidad[];
  cargando: boolean;
  seleccionadaId?: string;
  onSeleccion?: (entidad: Entidad) => void;
  orden: Orden;
  onOrdenar?: (clave: string) => void;
};

export const Tabla = ({
  cabeceras,
  datos,
  cargando,
  seleccionadaId,
  onSeleccion,
  orden,
  onOrdenar,
}: TablaProps) => {
  return (
    <quimera-tabla>
      <table>
        <thead>
          <tr>{cabecera(cabeceras, orden, onOrdenar)}</tr>
        </thead>
        <tbody data-cargando={cargando}>
          {datos.map((entidad) => (
            <tr
              key={entidad.id}
              onClick={() => onSeleccion && onSeleccion(entidad)}
              data-seleccionada={entidad.id === seleccionadaId}
            >
              {fila(entidad)}
            </tr>
          ))}
        </tbody>
      </table>
    </quimera-tabla>
  );
};
