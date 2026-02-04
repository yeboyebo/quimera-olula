import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { useContext } from "react";
import { Pedido } from "../diseño.ts";
import { borrarPedido } from "../infraestructura.ts";

export const BorrarPedido = ({
  publicar,
  pedido,
}: {
  publicar: (evento: string, payload?: unknown) => void;
  pedido: Pedido;
}) => {
  const { intentar } = useContext(ContextoError);

  const borrar = async () => {
    if (pedido.id) {
      await intentar(() => borrarPedido(pedido.id));
    }
    publicar("borrado_de_pedido_listo");
  };

  return (
    <QModalConfirmacion
      nombre="confirmarBorrarPedido"
      abierto={true}
      titulo="Confirmar borrar"
      mensaje="¿Está seguro de que desea borrar este pedido?"
      onCerrar={() => publicar("borrar_cancelado")}
      onAceptar={borrar}
    />
  );
};
