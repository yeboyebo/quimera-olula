import { pareceImporte } from "@olula/componentes/maestro/widgets/dominio.ts";
import { Link } from "react-router";
import {
  ComponenteDashboard,
  GrupoAgregado,
  RecursoAgregable,
  RespuestaAgregado,
} from "../../diseño.ts";
import { formatearValor } from "../../dominio.ts";

const RE_FECHA = /^\d{4}-\d{2}-\d{2}$/;

const celda = (valor: GrupoAgregado[string], columna: string, esMedida: boolean) => {
  if (valor === null || valor === undefined || valor === "") return "—";
  if (typeof valor === "boolean") return valor ? "Sí" : "No";
  if (typeof valor === "number") {
    return formatearValor(valor, esMedida && pareceImporte(columna) ? "moneda" : "numero");
  }
  if (RE_FECHA.test(valor)) return new Date(`${valor}T00:00:00`).toLocaleDateString("es-ES");
  return valor;
};

/** Filas de un listado con su filtro; cada fila abre su ficha. */
export const Tabla = ({
  componente,
  respuesta,
  recurso,
}: {
  componente: ComponenteDashboard;
  respuesta: RespuestaAgregado;
  recurso: RecursoAgregable | undefined;
}) => {
  const columnas = (componente.consultas[0].columnas ?? "").split(",").filter(Boolean);
  const descripcion = (id: string) =>
    recurso?.dimensiones.find((d) => d.id === id)?.descripcion ??
    recurso?.medidas.find((m) => m.id === id)?.descripcion ??
    id;
  const esMedida = (id: string) => Boolean(recurso?.medidas.some((m) => m.id === id));

  return (
    <div className="dashboard-tabla">
      <table>
        <thead>
          <tr>
            {columnas.map((c) => (
              <th key={c} data-numero={esMedida(c) || undefined}>
                {descripcion(c)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {respuesta.grupos.map((fila, i) => (
            <tr key={String(fila.id ?? i)}>
              {columnas.map((c, j) => (
                <td key={c} data-numero={esMedida(c) || undefined}>
                  {j === 0 && recurso?.ruta && fila.id != null ? (
                    <Link to={`${recurso.ruta}/${fila.id}`}>{celda(fila[c], c, esMedida(c))}</Link>
                  ) : (
                    celda(fila[c], c, esMedida(c))
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {respuesta.truncado && recurso?.ruta && (
        <Link className="dashboard-tabla-mas" to={recurso.ruta}>
          Ver las {respuesta.total_grupos} en {recurso.descripcion.split(" (")[0]} →
        </Link>
      )}
    </div>
  );
};
