import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { Factura } from "../diseño.ts";
import { borrarFactura } from "../infraestructura.ts";

export const BorrarFactura = ({
  publicar,
  factura,
}: {
  publicar: (evento: string, payload?: unknown) => void;
  factura: Factura;
}) => {
  const borrar = async () => {
    if (factura.id) {
      await borrarFactura(factura.id);
    }
    publicar("borrado_de_factura_listo");
  };

  return (
    <QModalConfirmacion
      nombre="confirmarBorrarFactura"
      abierto={true}
      titulo="Confirmar borrar"
      mensaje="¿Está seguro de que desea borrar esta factura?"
      onCerrar={() => publicar("borrar_cancelado")}
      onAceptar={borrar}
    />
  );
};
