import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useContext } from "react";
import { LineaTransferenciaStock } from "../../diseño.ts";
import { eliminarLineaTransferenciaStock } from "../../infraestructura.ts";

export const BorrarLineaTransferenciaStock = ({
  publicar,
  activo = false,
  linea,
  transferenciaID,
}: {
  publicar: EmitirEvento;
  linea: LineaTransferenciaStock;
  activo: boolean;
  transferenciaID: string;
}) => {
  const { intentar } = useContext(ContextoError);

  const borrar = async () => {
    if (linea.id) {
      await intentar(() =>
        eliminarLineaTransferenciaStock(transferenciaID, linea.id)
      );
    }
    publicar("linea_transferencia_borrada");
  };

  return (
    <QModalConfirmacion
      nombre="confirmarBorrarLineaTransferenciaStock"
      abierto={activo}
      titulo="Confirmar borrado"
      mensaje="¿Está seguro de que desea borrar esta linea?"
      onCerrar={() => publicar("borrado_cancelado")}
      onAceptar={borrar}
    />
  );
};
