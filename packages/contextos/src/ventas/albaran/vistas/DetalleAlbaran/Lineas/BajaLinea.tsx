import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { useContext } from "react";
import { deleteLinea } from "../../../infraestructura.ts";

export const BajaLinea = ({
  publicar,
  activo = false,
  idLinea,
  idAlbaran,
  refrescarCabecera,
}: {
  publicar: (evento: string, payload?: unknown) => void;
  idLinea?: string;
  idAlbaran: string;
  activo?: boolean;
  refrescarCabecera: () => void;
}) => {
  const { intentar } = useContext(ContextoError);

  const borrar = async () => {
    if (idLinea) {
      await intentar(() => deleteLinea(idAlbaran, idLinea));
    }

    publicar("borrado_confirmado");
    refrescarCabecera();
  };

  return (
    <QModalConfirmacion
      nombre="confirmarBorrarLinea"
      abierto={activo}
      titulo="Confirmar borrado"
      mensaje="¿Está seguro de que desea borrar esta línea?"
      onCerrar={() => publicar("borrado_cancelado")}
      onAceptar={borrar}
    />
  );
};
