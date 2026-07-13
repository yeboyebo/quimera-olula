import { QAvatar, QBadge, QBoton, QIcono } from "@olula/componentes/index.js";
import { formatearFechaDate, formatearMoneda } from "@olula/lib/dominio.js";
import { OportunidadVenta } from "../diseño.ts";
import "./TarjetaOportunidadVentaKanban.css";

const claseProbabilidad = (probabilidad: number) => {
  if (probabilidad >= 75) return "muyprobable";
  if (probabilidad >= 50) return "probable";
  return "improbable";
};

const getColorImporte = (probabilidad: number): string => {
  if (probabilidad >= 75) return "importe-alta";
  if (probabilidad >= 50) return "importe-media";
  return "importe-baja";
};

type EstadoVencimiento = {
  clase: "vencida" | "hoy" | "manana" | "proxima" | "normal";
  texto: string;
};

const getEstadoVencimiento = (
  fechaCierre: Date | null | undefined
): EstadoVencimiento | null => {
  if (!fechaCierre) return null;

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const cierre = new Date(fechaCierre);
  cierre.setHours(0, 0, 0, 0);

  const dias = Math.floor(
    (cierre.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (dias < 0) {
    const diasVencida = Math.abs(dias);
    return {
      clase: "vencida",
      texto: `Vencida hace ${diasVencida} día${diasVencida === 1 ? "" : "s"}`,
    };
  }

  if (dias === 0) return { clase: "hoy", texto: "Vence hoy" };
  if (dias === 1) return { clase: "manana", texto: "Vence mañana" };
  if (dias <= 7) return { clase: "proxima", texto: `Vence en ${dias} días` };

  return { clase: "normal", texto: `Vence en ${dias} días` };
};

export const TarjetaOportunidadVentaKanban = (
  oportunidad: OportunidadVenta
) => {
  const probabilidad = oportunidad.probabilidad ?? 0;
  const importe = oportunidad.importe ?? 0;
  const estadoVencimiento = getEstadoVencimiento(oportunidad.fecha_cierre);
  const accionesPendientes = oportunidad.acciones_pendientes;

  return (
    <article className="TarjetaOportunidadVentaKanban">
      <header className="tarjeta-kanban-cabecera">
        <div className="tarjeta-kanban-indicadores">
          <QAvatar className={claseProbabilidad(probabilidad)} tamaño="sm">
            {`${probabilidad}%`}
          </QAvatar>
          <span className="tarjeta-kanban-estado">
            {oportunidad.descripcion_estado || "Sin estado"}
          </span>
        </div>

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

      <div className="tarjeta-kanban-linea-datos">
        <span className="tarjeta-kanban-fecha">
          {oportunidad.fecha_cierre
            ? formatearFechaDate(oportunidad.fecha_cierre)
            : "-"}
        </span>

        <strong
          className={`tarjeta-kanban-importe ${getColorImporte(probabilidad)}`}
        >
          {formatearMoneda(importe, "EUR")}
        </strong>
      </div>

      {estadoVencimiento && estadoVencimiento.clase !== "normal" && (
        <div className="badges-container tarjeta-kanban-urgencia">
          <QBadge
            variante={
              estadoVencimiento.clase === "vencida"
                ? "error"
                : estadoVencimiento.clase === "hoy"
                  ? "advertencia"
                  : "primario"
            }
          >
            {estadoVencimiento.texto}
          </QBadge>
        </div>
      )}

      <footer className="tarjeta-kanban-pie">
        {typeof accionesPendientes === "number" ? (
          <span className="tarjeta-kanban-acciones-pendientes">
            {`Acciones pendientes: ${accionesPendientes}`}
          </span>
        ) : (
          <span className="tarjeta-kanban-acciones-pendientes sin-dato">
            Acciones pendientes: -
          </span>
        )}
      </footer>
    </article>
  );
};
