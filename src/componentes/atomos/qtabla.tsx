import { ReactNode } from "react";
import { Entidad, Orden } from "../../contextos/comun/diseño.ts";
import { formatearMoneda } from "../../contextos/comun/dominio.ts";
import "./qtabla.css";

type MetaColumna<T extends Entidad> = {
  id: string;
  cabecera: string;
  tipo?:
    | "texto"
    | "numero"
    | "moneda"
    | "fecha"
    | "hora"
    | "booleano"
    | undefined;
  divisa?: string;
  render?: (entidad: T) => string | ReactNode;
};

export type MetaTabla<T extends Entidad> = MetaColumna<T>[];

const cabecera = <T extends Entidad>(
  metaTabla: MetaTabla<T>,
  orden: Orden,
  onOrdenar?: (clave: string) => void
) => {
  const [colOrdenada, sentido] = Array.isArray(orden) ? orden : [null, null];

  const renderCabecera = ({ id, cabecera, tipo }: MetaColumna<T>) => (
    <th
      key={id}
      data-modo="columna"
      data-orden={id === colOrdenada ? sentido : ""}
      className={`${tipo ?? ""} ${id}`}
      onClick={() => onOrdenar && onOrdenar(id)}
    >
      {cabecera}
    </th>
  );

  return metaTabla.map(renderCabecera);
};

const fila = <T extends Entidad>(entidad: Entidad, metaTabla: MetaTabla<T>) => {
  const renderColumna = ({ id, render, tipo, divisa }: MetaColumna<T>) => {
    let datos = render?.(entidad as T) ?? (entidad[id] as string);

    if (tipo === "moneda" && typeof datos === "number") {
      datos = formatearMoneda(datos, divisa ?? "EUR");
    }

    return (
      <td key={[entidad.id, id].join("-")} className={`${tipo ?? ""} ${id}`}>
        {datos}
      </td>
    );
  };

  return metaTabla.map(renderColumna);
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
