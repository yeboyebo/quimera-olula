import { QAvatar, QBadge } from "@olula/componentes/index.js";
import { formatearFechaDate, formatearMoneda } from "@olula/lib/dominio.js";
import { OportunidadVenta } from "../diseño.ts";
import "./TarjetaOportunidadVenta.css";

const claseProbabilidad = (probabilidad: number) => {
  if (probabilidad >= 75) return "muyprobable";
  if (probabilidad >= 50) return "probable";
  return "improbable";
};

const getColorImporte = (importe: number): string => {
  if (importe >= 30000) return "importe-grande";
  if (importe >= 10000) return "importe-medio";
  return "importe-pequeño";
};

const estaVencePronto = (fechaCierre: Date | null | undefined): boolean => {
  if (!fechaCierre) return false;
  const hoy = new Date();
  const dias = Math.floor(
    (fechaCierre.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
  );
  return dias >= 0 && dias <= 7;
};

export const TarjetaOportunidadVenta = (oportunidad: OportunidadVenta) => {
  const importe = oportunidad.importe ?? 0;
  const vencePronto = estaVencePronto(oportunidad.fecha_cierre);

  return (
    <article className="TarjetaOportunidadVenta">
      <div className="tarjeta-cabecera">
        <QAvatar className={claseProbabilidad(oportunidad.probabilidad)}>
          {oportunidad.probabilidad + "%"}
        </QAvatar>
        <div className="tarjeta-titulo">{oportunidad.descripcion}</div>
      </div>

      <div className="tarjeta-cliente">{oportunidad.nombre_cliente}</div>

      {vencePronto && (
        <div className="tarjeta-badges">
          <QBadge variante="error">🔥 Vence pronto</QBadge>
        </div>
      )}

      <footer className="tarjeta-pie">
        <div className="tarjeta-fecha">
          {oportunidad.fecha_cierre
            ? formatearFechaDate(oportunidad.fecha_cierre)
            : "-"}
        </div>
        <div className={`tarjeta-importe ${getColorImporte(importe)}`}>
          {formatearMoneda(importe, "EUR")}
        </div>
      </footer>
    </article>
  );
};
