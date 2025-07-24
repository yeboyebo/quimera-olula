import { ReactNode } from "react";
import { Entidad, Orden, Paginacion } from "../../contextos/comun/diseño.ts";
import { formatearMoneda } from "../../contextos/comun/dominio.ts";
import { QBoton } from "./qboton.tsx";
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
  const [colOrdenada, sentido] = orden;

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

const paginacionControlador = (
  paginacion: Paginacion,
  onPaginacion?: (pagina: number, limite: number) => void
) => {
  return (
    <quimera-tabla-paginacion>
      <QBoton
        deshabilitado={paginacion?.pagina === 1}
        tamaño="pequeño"
        variante="texto"
        onClick={() =>
          onPaginacion && onPaginacion(paginacion.limite, paginacion.pagina - 1)
        }
      >
        &lt;
      </QBoton>
      <QBoton
        tamaño="pequeño"
        variante="borde"
        onClick={() =>
          onPaginacion && onPaginacion(paginacion.limite, paginacion.pagina + 1)
        }
      >
        &gt;
      </QBoton>
    </quimera-tabla-paginacion>
  );
};

export type QTablaProps<T extends Entidad> = {
  metaTabla: MetaTabla<T>;
  datos: T[];
  cargando: boolean;
  seleccionadaId?: string;
  onSeleccion?: (entidad: T) => void;
  orden: Orden;
  onOrdenar?: (clave: string) => void;
  paginacion: Paginacion;
  onPaginacion?: (pagina: number, limite: number) => void;
};

export const QTabla = <T extends Entidad>({
  metaTabla,
  datos,
  cargando,
  seleccionadaId,
  onSeleccion,
  orden,
  onOrdenar,
  paginacion,
  onPaginacion,
}: QTablaProps<T>) => {
  return (
    <>
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
        {paginacionControlador(paginacion, onPaginacion)}
      </quimera-tabla>
    </>
  );
};
