import { useContext } from "react";
import { QModalConfirmacion } from "../../../../componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "../../../comun/contexto.ts";
import { TransferenciaStock } from "../diseño.ts";
import { eliminarTransferenciaStock } from "../infraestructura.ts";

export const BorrarTransferenciaStock = ({
  publicar,
  activo = false,
  transferencia,
}: {
  publicar: (evento: string, payload?: unknown) => void;
  transferencia: TransferenciaStock;
  activo: boolean;
}) => {
  const { intentar } = useContext(ContextoError);

  const borrar = async () => {
    if (transferencia.id) {
      await intentar(() => eliminarTransferenciaStock(transferencia.id));
    }
    publicar("transferencia_borrada");
  };

  return (
    <QModalConfirmacion
      nombre="confirmarBorrarTransferenciaStock"
      abierto={activo}
      titulo="Confirmar borrado"
      mensaje="¿Está seguro de que desea borrar esta transferencia?"
      onCerrar={() => publicar("borrado_cancelado")}
      onAceptar={borrar}
    />
  );
};
