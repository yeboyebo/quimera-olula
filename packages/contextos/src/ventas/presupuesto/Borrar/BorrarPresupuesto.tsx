import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { useContext } from "react";
import { Presupuesto } from "../diseño.ts";
import { borrarPresupuesto } from "../infraestructura.ts";

export const BorrarPresupuesto = ({
  publicar,
  activo = false,
  presupuesto,
}: {
  publicar: (evento: string, payload?: unknown) => void;
  presupuesto: Presupuesto;
  activo: boolean;
}) => {
  const { intentar } = useContext(ContextoError);

  const borrar = async () => {
    if (presupuesto.id) {
      await intentar(() => borrarPresupuesto(presupuesto.id));
    }
    publicar("presupuesto_borrado");
    publicar("cancelar_borrado");
  };

  return (
    <QModalConfirmacion
      nombre="confirmarBorrarPresupuesto"
      abierto={activo}
      titulo="Confirmar borrar"
      mensaje="¿Está seguro de que desea borrar este presupuesto?"
      onCerrar={() => publicar("cancelar_borrado")}
      onAceptar={borrar}
    />
  );
};
