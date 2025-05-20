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
  detalleExtra?: (entidad: T) => ReactNode;
  mostrarCabecera?: boolean;
};

export const QTabla = <T extends Entidad>({
  metaTabla,
  datos,
  cargando,
  seleccionadaId,
  onSeleccion,
  orden,
  onOrdenar,
  detalleExtra,
  mostrarCabecera = true,
}: QTablaProps<T>) => {
  return (
    <quimera-tabla>
      <table>
        {mostrarCabecera && (
          <thead>
            <tr>{cabecera(metaTabla, orden, onOrdenar)}</tr>
          </thead>
        )}
        <tbody data-cargando={cargando}>
          {datos.map((entidad: T, index: number) => {
            const filaClase = index % 2 === 0 ? "cebra" : undefined;
            return (
              <>
                <tr
                  key={entidad.id}
                  className={filaClase}
                  onClick={() => onSeleccion && onSeleccion(entidad)}
                  data-seleccionada={entidad.id === seleccionadaId}
                >
                  {fila(entidad, metaTabla)}
                </tr>
                {detalleExtra && (
                  <tr className={`detalle-extra ${filaClase || ""}`}>
                    {detalleExtra(entidad)}
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>
    </quimera-tabla>
  );
};
