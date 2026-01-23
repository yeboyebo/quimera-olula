import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.js";

export const BorrarLinea = ({
  publicar,
  idLinea,
}: {
  publicar: EmitirEvento;
  idLinea: string;
}) => {
  return (
    <QModalConfirmacion
      nombre="confirmarBorrarLinea"
      abierto={true}
      titulo="Borrar línea"
      mensaje="¿Está seguro de que desea borrar esta línea?"
      onCerrar={() => publicar("borrar_linea_cancelado")}
      onAceptar={() => publicar("borrado_de_linea_listo", idLinea)}
    />
  );
};
