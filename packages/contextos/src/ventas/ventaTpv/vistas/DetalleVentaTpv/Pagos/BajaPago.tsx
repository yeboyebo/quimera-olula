import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { useContext } from "react";
import { deletePago } from "../../../infraestructura.ts";

export const BajaPago = ({
  publicar,
  activo = false,
  idPago,
  idVenta,
}: {
  publicar: (evento: string, payload?: unknown) => void;
  idPago?: string;
  idVenta: string;
  activo?: boolean;
}) => {
  const { intentar } = useContext(ContextoError);

  const borrar = async () => {
    if (idPago) {
      await intentar(() => deletePago(idVenta, idPago));
    }

    publicar("pago_borrado");
  };

  return (
    <QModalConfirmacion
      nombre="confirmarBorrarPago"
      abierto={activo}
      titulo="Confirmar borrado"
      mensaje="¿Está seguro de que desea borrar este pago?"
      onCerrar={() => publicar("pago_borrado_cancelado")}
      onAceptar={borrar}
    />
  );
};
