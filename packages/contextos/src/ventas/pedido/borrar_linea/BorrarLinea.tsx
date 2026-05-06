import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { useCallback, useContext } from "react";
import { deleteLinea } from "../infraestructura.ts";

export const BorrarLinea = ({
  pedidoId,
  publicar,
  idLinea,
}: {
  pedidoId: string;
  publicar: ProcesarEvento;
  idLinea: string;
}) => {
  const { intentar } = useContext(ContextoError);

  const borrar = useCallback(async () => {
    await intentar(() => deleteLinea(pedidoId, idLinea));
    publicar("linea_borrada");
  }, [pedidoId, idLinea, publicar, intentar]);
  return (
    <QModalConfirmacion
      nombre="confirmarBorrarLinea"
      abierto={true}
      titulo="Borrar línea"
      mensaje="¿Está seguro de que desea borrar esta línea?"
      onCerrar={() => publicar("borrar_linea_cancelado")}
      onAceptar={borrar}
    />
  );
};
