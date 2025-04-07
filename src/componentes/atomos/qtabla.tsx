import { ReactNode } from "react";
import { Entidad, Orden } from "../../contextos/comun/diseño.ts";
import "./qtabla.css";

type MetaColumna<T extends Entidad> = {
  id: string;
  cabecera: string;
  render?: (entidad: T) => string | ReactNode;
};

export type MetaTabla<T extends Entidad> = MetaColumna<T>[];

const cabecera = <T extends Entidad>(
  metaTabla: MetaTabla<T>,
  orden: Orden,
  onOrdenar?: (clave: string) => void
) => {
  const clavePrincipal = "id";

  const renderCabecera = ({ id, cabecera }: MetaColumna<T>) => (
    <th
      key={id}
      data-modo="columna"
      data-orden={orden[id] ?? ""}
      onClick={() => onOrdenar && onOrdenar(id)}
    >
      {cabecera}
    </th>
  );

  const cabeceraPrincipal = metaTabla.find(({ id }) => id === clavePrincipal)!;
  const cabeceras = metaTabla.filter(({ id }) => id !== clavePrincipal);
  console.log(cabeceraPrincipal, cabeceras);

  return [cabeceraPrincipal, ...cabeceras].map(renderCabecera);
};

const fila = <T extends Entidad>(entidad: Entidad, metaTabla: MetaTabla<T>) => {
  const clavePrincipal = "id";

  const renderColumna = ({ id, render }: MetaColumna<T>) => [
    render ? render(entidad as T) : (entidad[id] as string),
    id,
  ];

  const datosPrincipal = renderColumna(
    metaTabla.find(({ id }) => id === clavePrincipal)!
  );
  const datosFila = metaTabla
    .filter(({ id }) => id !== clavePrincipal)
    .map(renderColumna);

  return [
    <th key={[entidad.id, clavePrincipal].join("-")} data-modo="fila">
      {datosPrincipal[0]}
    </th>,
    ...datosFila.map(([valorCelda, columna]) => (
      <td key={[entidad.id, columna].join("-")}>{valorCelda}</td>
    )),
  ];
};

export type QTablaProps<T extends Entidad> = {
  metaTabla: MetaTabla<T>;
  datos: T[];
  cargando: boolean;
  seleccionadaId?: string;
  onSeleccion?: (entidad: T) => void;
  orden: Orden;
  onOrdenar?: (clave: string) => void;
};

export const QTabla = <T extends Entidad>({
  metaTabla,
  datos,
  cargando,
  seleccionadaId,
  onSeleccion,
  orden,
  onOrdenar,
}: QTablaProps<T>) => {
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
              onClick={() => onSeleccion && onSeleccion(entidad)}
              data-seleccionada={entidad.id === seleccionadaId}
            >
              {fila(entidad, metaTabla)}
            </tr>
          ))}
        </tbody>
      </table>
    </quimera-tabla>
  );
};
