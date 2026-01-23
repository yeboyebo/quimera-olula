import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { useContext } from "react";
import { Presupuesto } from "../diseño.ts";
import { borrarPresupuesto } from "../infraestructura.ts";

export const BorrarPresupuesto = ({
  publicar,
  presupuesto,
}: {
  publicar: (evento: string, payload?: unknown) => void;
  presupuesto: Presupuesto;
}) => {
  const { intentar } = useContext(ContextoError);

  const borrar = async () => {
    if (presupuesto.id) {
      await intentar(() => borrarPresupuesto(presupuesto.id));
    }
    publicar("presupuesto_borrado");
    publicar("borrar_presupuesto_cancelado");
  };

  return (
    <QModalConfirmacion
      nombre="confirmarBorrarPresupuesto"
      abierto={true}
      titulo="Confirmar borrar"
      mensaje="¿Está seguro de que desea borrar este presupuesto?"
      onCerrar={() => publicar("borrar_presupuesto_cancelado")}
      onAceptar={borrar}
    />
  );
};
