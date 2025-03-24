import { Entidad, Orden } from "../../contextos/comun/diseño.ts";
import "./tabla.css";

type MetaColumna<T extends Entidad> = {
  id: string;
  cabecera: string;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  render?: (entidad: T) => any;
};

export type MetaTabla<T extends Entidad> = MetaColumna<T>[];


const cabecera = <T extends Entidad>(
  metaTabla: MetaTabla<T>,
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
  

const fila = <T extends Entidad>(entidad: Entidad, metaTabla: MetaTabla<T>, onSeleccion: ((entidad: T) => void) | undefined) => {
  const datosFila = metaTabla.map(({ id, render }) => render ? render(entidad as T) : entidad[id]);

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
  metaTabla: MetaTabla<T>;
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
