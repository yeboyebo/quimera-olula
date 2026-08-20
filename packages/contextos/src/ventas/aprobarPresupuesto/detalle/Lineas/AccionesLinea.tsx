import { QIcono } from "@olula/componentes/index.js";
import { ContextoError } from "@olula/lib/contexto.ts";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { useContext } from "react";
import { LineaAprobarPresupuesto } from "../../diseño.ts";
import { lineaCompleta } from "../../dominio.ts";
import { patchCerrarLineaPresupuesto } from "../../infraestructura.ts";
import "./AccionesLinea.css";

export const AccionesLinea = ({
  linea,
  presupuestoId,
  publicar,
}: {
  linea: LineaAprobarPresupuesto;
  presupuestoId: string;
  publicar: ProcesarEvento;
}) => {
  const { intentar } = useContext(ContextoError);

  const aPedir = linea.a_pedir || 0;
  const completo = lineaCompleta(linea);

  const colorAprobar = linea.cerrada
    ? undefined
    : completo
      ? "var(--color-exito)"
      : aPedir > 0
        ? "var(--color-advertencia)"
        : undefined;

  // El nombre accesible y el título visual comparten el mismo texto para que
  // el estado (no solo el color) llegue también a lectores de pantalla.
  const etiquetaCandado = linea.cerrada ? "Abrir línea" : "Cerrar línea";

  const etiquetaAprobar = linea.cerrada
    ? "Línea cerrada: no se puede aprobar"
    : completo
      ? "Aprobar toda la línea (queda completa)"
      : aPedir > 0
        ? `Aprobar toda la línea (${aPedir} unidades pendientes)`
        : "Aprobar toda la línea";

  const toggleCerrada = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!linea.id) return;
    const cerrada = !linea.cerrada;
    await intentar(() => patchCerrarLineaPresupuesto(presupuestoId, linea.id, cerrada));
    publicar("linea_cerrada_actualizada", { id: linea.id, cerrada });
  };

  const aprobar = (e: React.MouseEvent) => {
    e.stopPropagation();
    publicar("linea_aprobada", linea.id);
  };

  return (
    <div className="acciones-linea">
      <button
        type="button"
        className="accion-icono"
        onClick={toggleCerrada}
        title={etiquetaCandado}
        aria-label={etiquetaCandado}
        aria-pressed={!!linea.cerrada}
      >
        <QIcono
          nombre={linea.cerrada ? "candado" : "candado_abierto"}
          tamaño="sm"
          color={linea.cerrada ? "var(--color-error)" : undefined}
        />
      </button>
      <button
        type="button"
        className="accion-icono"
        onClick={aprobar}
        disabled={linea.cerrada}
        title={etiquetaAprobar}
        aria-label={etiquetaAprobar}
      >
        {/* La forma del icono (check vs. doble check) distingue el estado
            "línea completa" sin depender solo del color para verlo. */}
        <QIcono
          nombre={completo ? "checkdoble" : "check"}
          tamaño="sm"
          color={colorAprobar}
        />
      </button>
    </div>
  );
};
