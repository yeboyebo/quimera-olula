import { QTarjetaResumen } from "@olula/componentes/atomos/qtarjeta_resumen.tsx";
import { COLORES_SERIE } from "@olula/componentes/tema/colores_graficos.ts";
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

/** Pie a la derecha: el periodo de la consulta (como en los widgets del maestro). */
const pieTarjeta = (componente: ComponenteDashboard) => textoPeriodo(componente);

/**
 * Tarjeta de indicador con el mismo diseño que los widgets del maestro:
 * título a la izquierda; valor, variación y pie alineados a la derecha.
 */
export const Tarjeta = ({
  componente,
  respuesta,
  cargando,
}: {
  componente: ComponenteDashboard;
  respuesta: RespuestaAgregado;
  cargando?: boolean;
}) => {
  const consulta = componente.consultas[0];
  const [alias] = aliasMetricas(consulta.metricas);
  const formato = componente.opciones.formato ?? formatoPorDefecto(consulta.metricas);
  const actual = respuesta.totales[alias];
  const cambio = variacion(actual, respuesta.comparacion?.totales[alias]);

  return (
    <QTarjetaResumen
      titulo={componente.titulo}
      valor={formatearValor(actual, formato)}
      comparacion={
        cambio
          ? {
              valor: `${cambio.texto} ${textoComparacion(componente)}`,
              positivo: cambio.positiva,
            }
          : null
      }
      pie={pieTarjeta(componente)}
      cargando={cargando}
    />
  );
};

/** Valor frente a una meta, misma cáscara que la tarjeta del maestro. */
export const Objetivo = ({
  componente,
  respuesta,
  cargando,
}: {
  componente: ComponenteDashboard;
  respuesta: RespuestaAgregado;
  cargando?: boolean;
}) => {
  const consulta = componente.consultas[0];
  const [alias] = aliasMetricas(consulta.metricas);
  const formato = componente.opciones.formato ?? formatoPorDefecto(consulta.metricas);
  const actual = respuesta.totales[alias] ?? 0;
  const meta = componente.opciones.meta ?? 0;
  const porcentaje = meta > 0 ? Math.round((actual / meta) * 100) : 0;

  return (
    <quimera-tarjeta-resumen data-cargando={cargando || undefined} data-tipo="objetivo">
      <div className="cabecera">
        <span className="titulo">{componente.titulo}</span>
      </div>
      <span className="valor">{porcentaje} %</span>
      <div
        className="dashboard-objetivo-barra"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.min(porcentaje, 100)}
        aria-label={`${porcentaje} % del objetivo`}
      >
        <div style={{ width: `${Math.min(porcentaje, 100)}%`, background: COLORES_SERIE[0] }} />
      </div>
      <span className="pie">
        {formatearValor(actual, formato)} de {formatearValor(meta, formato)}
      </span>
    </quimera-tarjeta-resumen>
  );
};
