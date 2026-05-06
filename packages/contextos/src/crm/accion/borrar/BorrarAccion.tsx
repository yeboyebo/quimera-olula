import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { useForm } from "@olula/lib/useForm.js";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { useCallback } from "react";
import { Accion } from "../diseño.ts";
import { deleteAccion } from "../infraestructura.ts";

export const BorrarAccion = ({
  publicar,
  accion,
}: {
  accion: Accion;
  publicar: ProcesarEvento;
}) => {
  const borrar_ = useCallback(async () => {
    await deleteAccion(accion.id);

    publicar("accion_borrada", accion.id);
  }, [publicar, accion.id]);

  const cancelar_ = useCallback(
    () => publicar("borrado_accion_cancelado"),
    [publicar]
  );

  const [borrar, cancelar] = useForm(borrar_, cancelar_);

  return (
    <QModalConfirmacion
      nombre="confirmarBorrarAccion"
      abierto={true}
      titulo="Confirmar borrado"
      mensaje={`¿Está seguro de que desea borrar esta acción?`}
      onCerrar={cancelar}
      onAceptar={borrar}
    />
  );
};
