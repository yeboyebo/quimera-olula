import { ReactNode } from "react";
import { Entidad, Orden } from "../../contextos/comun/diseño.ts";
import { formatearFecha, formatearHora, formatearMoneda } from "../../contextos/comun/dominio.ts";
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
  ancho?: string; // Ancho específico para esta columna
  render?: (entidad: T) => string | ReactNode;
};

export type MetaTabla<T extends Entidad> = MetaColumna<T>[];

const cabecera = <T extends Entidad>(
  metaTabla: MetaTabla<T>,
  orden: Orden,
  onOrdenar?: (clave: string) => void
) => {
  const [colOrdenada, sentido] = orden;

  const renderCabecera = ({ id, cabecera, tipo, ancho }: MetaColumna<T>) => (
    <th
      key={id}
      data-modo="columna"
      data-orden={id === colOrdenada ? sentido : ""}
      className={`${tipo ?? ""} ${id}`}
      style={ancho ? { width: ancho } : undefined}
      onClick={() => onOrdenar && onOrdenar(id)}
    >
      {cabecera}
    </th>
  );

  return metaTabla.map(renderCabecera);
};

const fila = <T extends Entidad>(entidad: Entidad, metaTabla: MetaTabla<T>) => {
  const renderColumna = ({ id, render, tipo, divisa, ancho }: MetaColumna<T>) => {
    let datos = render?.(entidad as T) ?? (entidad[id] as string);

    // Formateo automático según tipo
    if (tipo === "moneda" && typeof datos === "number") {
      datos = formatearMoneda(datos, divisa ?? "EUR");
    } else if (tipo === "fecha" && typeof datos === "string") {
      datos = formatearFecha(datos);
    } else if (tipo === "hora" && typeof datos === "string") {
      datos = formatearHora(datos);
    } else if (tipo === "numero" && typeof datos === "number") {
      datos = datos.toLocaleString();
    }

    return (
      <td key={[entidad.id, id].join("-")} className={`${tipo ?? ""} ${id}`} style={ancho ? { width: ancho } : undefined}>
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
  // Detectar si hay anchos específicos
  const tieneAnchosFijos = metaTabla.some(col => col.ancho);
  
  // Calcular ancho mínimo y completar columnas sin ancho
  const metaTablaCompleta = tieneAnchosFijos ? metaTabla.map(col => {
    if (col.ancho) return col;
    // Asignar ancho por defecto según tipo
    const anchoPorDefecto = col.tipo === "texto" ? "150px" : 
                           col.tipo === "fecha" ? "90px" :
                           col.tipo === "hora" ? "80px" :
                           col.tipo === "moneda" ? "120px" :
                           col.tipo === "numero" ? "100px" :
                           col.tipo === "booleano" ? "100px" : "150px";
    return { ...col, ancho: anchoPorDefecto };
  }) : metaTabla;
  
  return (
    <quimera-tabla>
      <table data-anchos-fijos={tieneAnchosFijos}>
        <thead>
          <tr>{cabecera(metaTablaCompleta, orden, onOrdenar)}</tr>
        </thead>
        <tbody data-cargando={cargando}>
          {datos.map((entidad: T) => (
            <tr
              key={entidad.id}
              onClick={() => onSeleccion && onSeleccion(entidad)}
              data-seleccionada={entidad.id === seleccionadaId}
            >
              {fila(entidad, metaTablaCompleta)}
            </tr>
          ))}
        </tbody>
      </table>
    </quimera-tabla>
  );
};
