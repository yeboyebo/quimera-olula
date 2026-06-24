import { QAvatar, QTarjetaGenerica } from "@olula/componentes/index.js";
import { formatearFechaDate, formatearMoneda } from "@olula/lib/dominio.js";
import { OportunidadVenta } from "../diseño.ts";

export const TarjetaOportunidadVenta = (oportunidad: OportunidadVenta) => {
  const probabilidad =
    oportunidad.probabilidad >= 75
      ? "muyprobable"
      : oportunidad.probabilidad >= 50
        ? "probable"
        : "improbable";

  return (
    <QTarjetaGenerica
      avatar={
        <QAvatar className={probabilidad}>
          {oportunidad.probabilidad + "%"}
        </QAvatar>
      }
      arribaIzquierda={oportunidad.descripcion}
      arribaDerecha={
        oportunidad.fecha_cierre
          ? formatearFechaDate(oportunidad.fecha_cierre)
          : "-"
      }
      abajoIzquierda={oportunidad.nombre_cliente}
      abajoDerecha={formatearMoneda(oportunidad.importe, "EUR")}
    />
  );
};
