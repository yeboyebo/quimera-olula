import { QAvatar, QBoton, QIcono } from "@olula/componentes/index.js";
import { formatearFechaDate, formatearMoneda } from "@olula/lib/dominio.js";
import { OportunidadVenta } from "../diseño.ts";
import "./TarjetaOportunidadVentaKanban.css";

const claseProbabilidad = (probabilidad: number) => {
  if (probabilidad >= 75) return "muyprobable";
  if (probabilidad >= 50) return "probable";
  return "improbable";
};

export const TarjetaOportunidadVentaKanban = (
  oportunidad: OportunidadVenta
) => {
  const probabilidad = oportunidad.probabilidad ?? 0;

  return (
    <article className="TarjetaOportunidadVentaKanban">
      <header className="tarjeta-kanban-cabecera">
        <QAvatar className={claseProbabilidad(probabilidad)} tamaño="sm">
          {`${probabilidad}%`}
        </QAvatar>

        <QBoton variante="texto" tamaño="pequeño" deshabilitado>
          <QIcono nombre="lista_detalle" tamaño="sm" />
        </QBoton>
      </header>

      <div className="tarjeta-kanban-titulo">
        {oportunidad.descripcion || "-"}
      </div>

      <div className="tarjeta-kanban-cliente">
        {oportunidad.nombre_cliente || "-"}
      </div>

      <footer className="tarjeta-kanban-pie">
        <span className="tarjeta-kanban-fecha">
          {oportunidad.fecha_cierre
            ? formatearFechaDate(oportunidad.fecha_cierre)
            : "-"}
        </span>

        <strong className="tarjeta-kanban-importe">
          {formatearMoneda(oportunidad.importe ?? 0, "EUR")}
        </strong>
      </footer>
    </article>
  );
};
