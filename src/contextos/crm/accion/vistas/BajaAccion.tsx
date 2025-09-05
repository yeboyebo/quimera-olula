import { useContext } from "react";
import { QModalConfirmacion } from "../../../../componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "../../../comun/contexto.ts";
import { deleteAccion } from "../infraestructura.ts";

export const BajaAccion = ({
  emitir,
  activo = false,
  idAccion
}: {
  emitir: (evento: string, payload?: unknown) => void;
  idAccion?: string;
  activo?: boolean;
}) => {

  const { intentar } = useContext(ContextoError);
  
  const borrar = async () => {
    if (idAccion) {
      await intentar(() => deleteAccion(idAccion));
    }
    emitir("accion_borrada");
  };

  
  return (
    <QModalConfirmacion
        nombre="confirmarBorrarAccion"
        abierto={activo}
        titulo="Confirmar borrado"
        mensaje="¿Está seguro de que desea borrar esta acción?"
        onCerrar={() => emitir("borrado_cancelado")}
        onAceptar={borrar}
      />
  );
}