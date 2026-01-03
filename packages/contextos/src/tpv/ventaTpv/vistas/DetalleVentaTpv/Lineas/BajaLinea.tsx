import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { useContext } from "react";
import { deleteLinea } from "../../../infraestructura.ts";

export const BajaLinea = ({
  publicar,
  activo = false,
  idLinea,
  idFactura,
}: {
  publicar: (evento: string, payload?: unknown) => void;
  idLinea?: string;
  idFactura: string;
  activo?: boolean;
}) => {
  const { intentar } = useContext(ContextoError);

  const borrar = async () => {
    if (idLinea) {
      await intentar(() => deleteLinea(idFactura, idLinea));
    }

    publicar("linea_borrada");
  };

  return (
    <QModalConfirmacion
      nombre="confirmarBorrarLinea"
      abierto={activo}
      titulo="Confirmar borrado"
      mensaje="¿Está seguro de que desea borrar esta línea?"
      onCerrar={() => publicar("baja_linea_cancelada")}
      onAceptar={borrar}
    />
  );
};
