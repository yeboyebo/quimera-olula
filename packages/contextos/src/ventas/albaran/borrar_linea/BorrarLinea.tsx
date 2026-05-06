import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { useContext } from "react";
import { deleteLinea } from "../infraestructura.ts";

export const BorrarLinea = ({
  publicar,
  idLinea,
  albaranId,
}: {
  publicar: ProcesarEvento;
  idLinea: string;
  albaranId: string;
}) => {
  const { intentar } = useContext(ContextoError);

  const borrar = async () => {
    await intentar(() => deleteLinea(albaranId, idLinea));
    publicar("linea_borrada", idLinea);
  };

  const cancelar = () => {
    publicar("borrar_linea_cancelado");
  };

  return (
    <QModalConfirmacion
      nombre="confirmarBorrarLinea"
      abierto={true}
      titulo="Borrar línea"
      mensaje="¿Está seguro de que desea borrar esta línea?"
      onCerrar={cancelar}
      onAceptar={borrar}
    />
  );
};
