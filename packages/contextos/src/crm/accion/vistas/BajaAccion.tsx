import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { useContext } from "react";
import { deleteAccion } from "../infraestructura.ts";

export const BajaAccion = ({
  publicar,
  activo = false,
  idAccion,
}: {
  publicar: (evento: string, payload?: unknown) => void;
  idAccion?: string;
  activo?: boolean;
}) => {
  const { intentar } = useContext(ContextoError);

  const borrar = async () => {
    if (idAccion) {
      await intentar(() => deleteAccion(idAccion));
    }
    publicar("accion_borrada");
  };

  return (
    <QModalConfirmacion
      nombre="confirmarBorrarAccion"
      abierto={activo}
      titulo="Confirmar borrado"
      mensaje="¿Está seguro de que desea borrar esta acción?"
      onCerrar={() => publicar("borrado_cancelado")}
      onAceptar={borrar}
    />
  );
};
