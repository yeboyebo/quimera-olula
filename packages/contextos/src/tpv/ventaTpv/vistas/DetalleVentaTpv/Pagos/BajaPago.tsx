import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";

export const BajaPago = ({
  publicar,
  idPago,
}: {
  publicar: (evento: string, payload?: unknown) => void;
  idPago?: string;
}) => {

  return (
    <QModalConfirmacion
      nombre="confirmarBorrarPago"
      abierto={true}
      titulo="Borrar pago"
      mensaje="¿Está seguro de que desea borrar este pago?"
      onCerrar={() => publicar("pago_borrado_cancelado")}
      onAceptar={() => publicar("borrado_de_pago_listo", idPago)}
    />
  );
};
