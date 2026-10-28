import { ComponenteDashboard, RespuestaAgregado } from "../../diseño.ts";
import {
  aliasMetricas,
  formatearValor,
  formatoPorDefecto,
  RANGOS_PERIODO,
  leerPeriodo,
  variacion,
} from "../../dominio.ts";

const textoPeriodo = (componente: ComponenteDashboard) => {
  const [, rango] = leerPeriodo(componente.consultas[0]?.periodo);
  return RANGOS_PERIODO.find((r) => r.valor === rango)?.descripcion;
};

const textoComparacion = (componente: ComponenteDashboard) =>
  componente.consultas[0]?.comparar === "periodo_anterior"
    ? "vs periodo anterior"
    : "vs año anterior";

/** Un valor grande con su variación frente al otro periodo. */
export const Tarjeta = ({
  componente,
  respuesta,
}: {
  componente: ComponenteDashboard;
  respuesta: RespuestaAgregado;
}) => {
  const consulta = componente.consultas[0];
  const [alias] = aliasMetricas(consulta.metricas);
  const formato = componente.opciones.formato ?? formatoPorDefecto(consulta.metricas);
  const actual = respuesta.totales[alias];
  const cambio = variacion(actual, respuesta.comparacion?.totales[alias]);

  return (
    <div className="dashboard-tarjeta">
      <span className="dashboard-tarjeta-valor">{formatearValor(actual, formato)}</span>
      {cambio && (
        <span className="dashboard-tarjeta-variacion" data-positiva={cambio.positiva}>
          {cambio.positiva ? "▲" : "▼"} {cambio.texto}{" "}
          <span>{textoComparacion(componente)}</span>
        </span>
      )}
      {textoPeriodo(componente) && (
        <span className="dashboard-tarjeta-periodo">{textoPeriodo(componente)}</span>
      )}
    </div>
  );
};

/** Valor frente a una meta, con barra de progreso. */
export const Objetivo = ({
  componente,
  respuesta,
}: {
  componente: ComponenteDashboard;
  respuesta: RespuestaAgregado;
}) => {
  const consulta = componente.consultas[0];
  const [alias] = aliasMetricas(consulta.metricas);
  const formato = componente.opciones.formato ?? formatoPorDefecto(consulta.metricas);
  const actual = respuesta.totales[alias] ?? 0;
  const meta = componente.opciones.meta ?? 0;
  const porcentaje = meta > 0 ? Math.round((actual / meta) * 100) : 0;

  return (
    <div className="dashboard-tarjeta">
      <span className="dashboard-tarjeta-valor">{porcentaje} %</span>
      <div
        className="dashboard-objetivo-barra"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.min(porcentaje, 100)}
        aria-label={`${porcentaje} % del objetivo`}
      >
        <div style={{ width: `${Math.min(porcentaje, 100)}%` }} />
      </div>
      <span className="dashboard-tarjeta-periodo">
        {formatearValor(actual, formato)} de {formatearValor(meta, formato)}
      </span>
    </div>
  );
};
