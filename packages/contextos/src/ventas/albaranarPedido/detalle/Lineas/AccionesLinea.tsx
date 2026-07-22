import { QIcono } from "@olula/componentes/index.js";
import { ContextoError } from "@olula/lib/contexto.ts";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { useContext } from "react";
import { LineaAlbaranarPedido } from "../../diseño.ts";
import { calcularAEnviar } from "../../dominio.ts";
import { patchCerrarLineaPedido } from "../../infraestructura.ts";
import "./AccionesLinea.css";

export const AccionesLinea = ({
  linea,
  pedidoId,
  publicar,
}: {
  linea: LineaAlbaranarPedido;
  pedidoId: string;
  publicar: ProcesarEvento;
}) => {
  const { intentar } = useContext(ContextoError);

  const servida = linea.servida || 0;
  const aEnviar = calcularAEnviar(linea);
  const completo = aEnviar > 0 && aEnviar + servida >= linea.cantidad;

  const colorAprobar =
    linea.cerrada || aEnviar <= 0
      ? undefined
      : completo
        ? "var(--color-exito)"
        : "var(--color-advertencia)";

  const toggleCerrada = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!linea.id) return;
    const cerrada = !linea.cerrada;
    await intentar(() => patchCerrarLineaPedido(pedidoId, linea.id, cerrada));
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
        title={linea.cerrada ? "Abrir línea" : "Cerrar línea"}
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
        title="Aprobar toda la línea"
      >
        <QIcono nombre="check" tamaño="sm" color={colorAprobar} />
      </button>
    </div>
  );
};
