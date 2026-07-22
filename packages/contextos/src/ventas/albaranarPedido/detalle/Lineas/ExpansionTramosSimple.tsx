import { QBoton, QInput } from "@olula/componentes/index.js";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { useState } from "react";
import { LineaAlbaranarPedido } from "../../diseño.ts";
import "./ExpansionTramosSimple.css";

export const ExpansionTramosSimple = ({
  linea,
  publicar,
}: {
  linea: LineaAlbaranarPedido;
  publicar: ProcesarEvento;
}) => {
  const tramos = linea.tramos ?? [];
  const tramoExistente = tramos[0];
  const maximo = Math.max(0, linea.cantidad - (linea.servida || 0));

  const [cantidad, setCantidad] = useState<string>(
    tramoExistente ? String(tramoExistente.cantidad) : "0"
  );

  const guardar = () => {
    const valor = Math.min(maximo, Math.max(0, Number(cantidad) || 0));
    if (tramoExistente) {
      publicar("tramo_actualizado", {
        id: linea.id,
        tramo: { ...tramoExistente, cantidad: valor },
      });
    } else {
      publicar("tramos_actualizados", {
        id: linea.id,
        tramos: [{ id: `${linea.id}-tramo`, cantidad: valor }],
      });
    }
  };

  return (
    <div className="ExpansionTramosSimple">
      <QInput
        label="A enviar"
        nombre={`ets-${linea.id}`}
        tipo="numero"
        condensado
        deshabilitado={linea.cerrada}
        valor={cantidad}
        onChange={(v) => setCantidad(v)}
      />
      <QBoton tamaño="pequeño" deshabilitado={linea.cerrada} onClick={guardar}>
        Aprobar
      </QBoton>
    </div>
  );
};
