import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useCallback, useContext } from "react";
import { deleteLinea } from "../infraestructura.ts";

export const BorrarLinea = ({
  presupuestoId,
  publicar,
  idLinea,
}: {
  presupuestoId: string;
  publicar: EmitirEvento;
  idLinea: string;
}) => {
  const { intentar } = useContext(ContextoError);

  const borrar = useCallback(async () => {
    await intentar(() => deleteLinea(presupuestoId, idLinea));
    publicar("linea_borrada");
  }, [presupuestoId, idLinea, publicar, intentar]);

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
