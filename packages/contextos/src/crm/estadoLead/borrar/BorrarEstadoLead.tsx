import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useForm } from "@olula/lib/useForm.js";
import { useCallback } from "react";
import { EstadoLead } from "../diseño.ts";
import { deleteEstadoLead } from "../infraestructura.ts";

export const BorrarEstadoLead = ({
  publicar,
  estado_lead,
}: {
  estado_lead: EstadoLead;
  publicar: EmitirEvento;
}) => {
  const borrar_ = useCallback(async () => {
    await deleteEstadoLead(estado_lead.id);

    publicar("estado_lead_borrado", estado_lead.id);
  }, [publicar, estado_lead.id]);

  const cancelar_ = useCallback(
    () => publicar("borrado_estado_lead_cancelado"),
    [publicar]
  );

  const [borrar, cancelar] = useForm(borrar_, cancelar_);

  return (
    <QModalConfirmacion
      nombre="confirmarBorrarEstadoLead"
      abierto={true}
      titulo="Confirmar borrado"
      mensaje={`¿Está seguro de que desea borrar este Estado de Lead?`}
      onCerrar={cancelar}
      onAceptar={borrar}
    />
  );
};
