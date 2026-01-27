import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { useContext } from "react";
import { Presupuesto } from "../diseño.ts";
import { aprobarPresupuesto } from "../infraestructura.ts";

export const AprobarPresupuesto = ({
  publicar,
  presupuesto,
}: {
  publicar: (evento: string, payload?: unknown) => void;
  presupuesto: Presupuesto;
}) => {
  const { intentar } = useContext(ContextoError);

  const aprobar = async () => {
    if (presupuesto.id) {
      await intentar(() => aprobarPresupuesto(presupuesto.id));
    }
    publicar("aprobacion_lista");
  };

  return (
    <QModalConfirmacion
      nombre="confirmarAprobarPresupuesto"
      abierto={true}
      titulo="Confirmar aprobación"
      mensaje="¿Está seguro de que desea aprobar este presupuesto?"
      onCerrar={() => publicar("aprobacion_cancelada")}
      onAceptar={aprobar}
    />
  );
};
