import { Entidad, Orden } from "../../contextos/comun/diseño.ts";
import "./tabla.css";

type MetaColumna = {
  id: string;
  cabecera: string;
  get: (entidad: Entidad) => any;
};

export type MetaTabla = MetaColumna[];


const cabecera = (
  metaTabla: MetaTabla,
  orden: Orden,
  onOrdenar?: (clave: string) => void
) => {
  return metaTabla.map(({ id, cabecera }) => (
    <th
      key={id}
      data-modo="columna"
      data-orden={orden[id] ?? ""}
      onClick={() => onOrdenar && onOrdenar(id)}
    >
      {cabecera}
    </th>
  ));
};
  

const fila = <T extends Entidad>(entidad: Entidad, metaTabla: MetaTabla, onSeleccion: ((entidad: T) => void) | undefined) => {
  const datosFila = metaTabla.map(({ get }) => get(entidad));

  return [
    datosFila.map((valorCelda, columna) => (
      <td
      key={[entidad.id, columna].join("-")}
      onClick={() => onSeleccion && onSeleccion(entidad as T)}
      >
        {valorCelda}
      </td>
    )),
  ];
};

export type TablaProps<T extends Entidad> = {
  metaTabla: MetaTabla;
  datos: T[];
  cargando: boolean;
  seleccionadaId?: string;
  onSeleccion?: (entidad: T) => void;
  orden: Orden;
  onOrdenar?: (clave: string) => void;
};

export const Tabla = <T extends Entidad>({
  cargando,
  datos,
  orden,
  metaTabla,
  seleccionadaId,
  onOrdenar,
  onSeleccion,
}: TablaProps<T>) => {
  return (
    <quimera-tabla>
      <table>
        <thead>
          <tr>{cabecera(metaTabla, orden, onOrdenar)}</tr>
        </thead>
        <tbody data-cargando={cargando}>
          {datos.map((entidad: T) => (
            <tr
              key={entidad.id}
              // onClick={() => onSeleccion && onSeleccion(entidad)}
              data-seleccionada={entidad.id === seleccionadaId}
            >
              {fila(entidad, metaTabla, onSeleccion)}
            </tr>
          ))}
        </tbody>
      </table>
    </quimera-tabla>
  );
};
