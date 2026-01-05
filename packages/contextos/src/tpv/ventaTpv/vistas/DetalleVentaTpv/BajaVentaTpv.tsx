import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { VentaTpv } from "../../diseño.ts";

export const BajaVentaTpv = ({
  publicar,
  venta,
}: {
  venta: VentaTpv;
  publicar: EmitirEvento;
}) => {

  return (
     <QModalConfirmacion
        nombre="borrarVenta"
        abierto={true}
        titulo="Borrar venta"
        mensaje={`¿Está seguro de que desea borrar la venta ${venta.codigo}?`}
        onCerrar={() => publicar("borrar_cancelado")}
        onAceptar={() => publicar("borrado_de_venta_listo")}
    />
  );
};
