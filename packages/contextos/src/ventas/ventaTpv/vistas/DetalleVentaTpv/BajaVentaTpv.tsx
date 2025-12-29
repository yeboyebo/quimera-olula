import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { useContext } from "react";
import { borrarFactura } from "../../infraestructura.ts";

export const BajaVentaTpv = ({
  publicar,
  activo = false,
  idVenta,
}: {
  publicar: (evento: string, payload?: unknown) => void;
  idVenta: string;
  activo?: boolean;
}) => {

  const { intentar } = useContext(ContextoError);

  const borrar = async () => {
        await intentar(() => borrarFactura(idVenta));
        publicar("venta_borrada");
    };

  return (
     <QModalConfirmacion
        nombre="borrarVenta"
        abierto={activo}
        titulo="Confirmar borrar"
        mensaje="¿Está seguro de que desea borrar esta venta?"
        onCerrar={() => publicar("borrar_cancelado")}
        onAceptar={borrar}
    />
  );
};
