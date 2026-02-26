import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";

export const BorrarLinea = ({
  publicar,
  idLinea,
}: {
  publicar: ProcesarEvento;
  idLinea: string;
}) => {
  return (
    <QModalConfirmacion
      nombre="confirmarBorrarLinea"
      abierto={true}
      titulo="Borrar línea"
      mensaje="¿Está seguro de que desea borrar esta línea?"
      onCerrar={() => publicar("borrar_linea_cancelado")}
      onAceptar={() => publicar("linea_borrada", idLinea)}
    />
  );
};
