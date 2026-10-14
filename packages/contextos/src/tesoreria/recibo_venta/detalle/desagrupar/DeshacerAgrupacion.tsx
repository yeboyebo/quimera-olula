import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useForm } from "@olula/lib/useForm.ts";
import { useCallback } from "react";
import { ReciboVenta } from "../../diseño.js";

export const DeshacerAgrupacion = ({
  recibo,
  publicar,
}: {
  recibo: ReciboVenta;
  publicar: EmitirEvento;
}) => {
  const deshacer_ = useCallback(
    async () => publicar("desagrupado_confirmado"),
    [publicar]
  );

  const cancelar_ = useCallback(
    () => publicar("desagrupado_cancelado"),
    [publicar]
  );

  const [deshacer, cancelar] = useForm(deshacer_, cancelar_);

  const mensaje = [
    `El recibo de grupo ${recibo.codigo} se eliminará.`,
    "",
    "Los recibos que agrupaba vuelven a quedar sueltos.",
  ].join("\n");

  return (
    <QModalConfirmacion
      nombre="deshacer_agrupacion_recibo_venta"
      abierto={true}
      titulo="Deshacer agrupación"
      mensaje={mensaje}
      onCerrar={cancelar}
      onAceptar={deshacer}
      labelAceptar="Deshacer"
    />
  );
};
