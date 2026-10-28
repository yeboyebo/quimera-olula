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

const metaDesdeColumnas = (
  columnas: string[],
  recurso: RecursoAgregable | undefined
): MetaTabla<FilaDashboard> =>
  columnas.map((id) => ({
    id,
    cabecera: etiquetaColumna(id, recurso),
    tipo: tipoColumna(id, recurso),
  }));

const filasDesdeRespuesta = (respuesta: RespuestaAgregado): FilaDashboard[] =>
  respuesta.grupos.map((fila, i) => ({
    ...fila,
    id: fila.id != null && fila.id !== "" ? String(fila.id) : `${SIN_ID}${i}`,
  }));

/** Filas de un listado con su filtro; usa la QTabla de la app. Clic en la fila abre la ficha. */
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
  const columnas = (componente.consultas[0].columnas ?? "").split(",").filter(Boolean);
  const datos = filasDesdeRespuesta(respuesta);
  const metaTabla = metaDesdeColumnas(columnas, recurso);

  return (
    <div className="dashboard-tabla">
      <QTabla
        metaTabla={metaTabla}
        datos={datos}
        cargando={false}
        orden={["", "ASC"]}
        onSeleccion={
          recurso?.ruta
            ? (fila) => {
                if (!fila.id.startsWith(SIN_ID)) navegar(`${recurso.ruta}/${fila.id}`);
              }
            : undefined
        }
      />
      {respuesta.truncado && recurso?.ruta && (
        <Link className="dashboard-tabla-mas" to={recurso.ruta}>
          Ver las {respuesta.total_grupos} en {recurso.descripcion.split(" (")[0]} →
        </Link>
      )}
    </div>
  );
};
