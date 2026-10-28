import { MetaTabla, QTabla } from "@olula/componentes/atomos/qtabla.tsx";
import { pareceImporte } from "@olula/componentes/maestro/widgets/dominio.ts";
import { Entidad } from "@olula/lib/diseño.ts";
import { Link, useNavigate } from "react-router";
import {
  ComponenteDashboard,
  RecursoAgregable,
  RespuestaAgregado,
} from "../../diseño.ts";

type FilaDashboard = Entidad & Record<string, string | number | boolean | null>;

const SIN_ID = "__sin_id__";

/** `/ventas/pedido` desde el recurso, o a partir de `ventas.pedido` / `ventas.pedido.linea`. */
const rutaRecurso = (
  recurso: RecursoAgregable | undefined,
  recursoId: string
): string | undefined => {
  if (recurso?.ruta) return recurso.ruta;
  const partes = recursoId.split(".").filter(Boolean);
  if (partes.length < 2) return undefined;
  return `/${partes[0]}/${partes[1]}`;
};

const idFila = (fila: Record<string, string | number | boolean | null>, indice: number): string => {
  const crudo = fila.id;
  if (crudo != null && crudo !== "") return String(crudo);
  return `${SIN_ID}${indice}`;
};

const tipoColumna = (
  id: string,
  recurso: RecursoAgregable | undefined
): NonNullable<MetaTabla<FilaDashboard>[number]["tipo"]> => {
  if (recurso?.medidas.some((m) => m.id === id)) {
    return pareceImporte(id) ? "moneda" : "numero";
  }
  const dim = recurso?.dimensiones.find((d) => d.id === id);
  if (dim?.tipo === "fecha") return "fecha";
  if (dim?.tipo === "numero") return "numero";
  if (dim?.tipo === "booleano") return "booleano";
  return "texto";
};

const etiquetaColumna = (id: string, recurso: RecursoAgregable | undefined) =>
  recurso?.dimensiones.find((d) => d.id === id)?.descripcion ??
  recurso?.medidas.find((m) => m.id === id)?.descripcion ??
  id;

const filasDesdeRespuesta = (respuesta: RespuestaAgregado): FilaDashboard[] =>
  respuesta.grupos.map((fila, i) => ({
    ...fila,
    id: idFila(fila, i),
  }));

const metaDesdeColumnas = (
  columnas: string[],
  recurso: RecursoAgregable | undefined,
  ruta: string | undefined
): MetaTabla<FilaDashboard> =>
  columnas.map((id, indice) => {
    const tipo = tipoColumna(id, recurso);
    const base = { id, cabecera: etiquetaColumna(id, recurso), tipo };
    // Primera columna: enlace real (ctrl/clic medio y URL al pasar el ratón).
    if (indice !== 0 || !ruta) return base;
    return {
      ...base,
      render: (fila: FilaDashboard) => {
        if (fila.id.startsWith(SIN_ID)) return valorCelda(fila, id, tipo);
        return <Link to={`${ruta}/${fila.id}`}>{valorCelda(fila, id, tipo)}</Link>;
      },
    };
  });

/** Misma presentación que QTabla para el texto del enlace. */
const valorCelda = (
  fila: FilaDashboard,
  columna: string,
  tipo: NonNullable<MetaTabla<FilaDashboard>[number]["tipo"]>
): string => {
  const valor = fila[columna];
  if (valor === null || valor === undefined || valor === "") return "—";
  if (tipo === "booleano" && typeof valor === "boolean") return valor ? "Sí" : "No";
  if (tipo === "numero" && typeof valor === "number") return valor.toLocaleString("es-ES");
  if (tipo === "moneda" && (typeof valor === "number" || typeof valor === "string")) {
    return Number(valor).toLocaleString("es-ES", { style: "currency", currency: "EUR" });
  }
  if (tipo === "fecha" && typeof valor === "string") {
    return new Date(`${valor}T00:00:00`).toLocaleDateString("es-ES");
  }
  return String(valor);
};

/** Filas de un listado con su filtro; QTabla nativa. Clic (o enlace) abre la ficha. */
export const Tabla = ({
  componente,
  respuesta,
  recurso,
}: {
  componente: ComponenteDashboard;
  respuesta: RespuestaAgregado;
  recurso: RecursoAgregable | undefined;
}) => {
  const navegar = useNavigate();
  const recursoId = componente.consultas[0]?.recurso ?? "";
  const ruta = rutaRecurso(recurso, recursoId);
  const columnas = (componente.consultas[0].columnas ?? "").split(",").filter(Boolean);
  const datos = filasDesdeRespuesta(respuesta);
  const metaTabla = metaDesdeColumnas(columnas, recurso, ruta);

  return (
    <div className="dashboard-tabla">
      <QTabla
        metaTabla={metaTabla}
        datos={datos}
        cargando={false}
        orden={["", "ASC"]}
        onSeleccion={
          ruta
            ? (fila) => {
                if (!fila.id.startsWith(SIN_ID)) navegar(`${ruta}/${fila.id}`);
              }
            : undefined
        }
      />
      {respuesta.truncado && ruta && (
        <Link className="dashboard-tabla-mas" to={ruta}>
          Ver las {respuesta.total_grupos}
          {recurso ? ` en ${recurso.descripcion.split(" (")[0]}` : ""} →
        </Link>
      )}
    </div>
  );
};
