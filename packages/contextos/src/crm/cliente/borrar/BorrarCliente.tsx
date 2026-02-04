import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { useForm } from "@olula/lib/useForm.js";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { useCallback } from "react";
import { Cliente } from "../diseño.ts";
import { deleteCliente } from "../infraestructura.ts";

export const BorrarCliente = ({
  publicar,
  cliente,
}: {
  cliente: Cliente;
  publicar: ProcesarEvento;
}) => {
  const borrar_ = useCallback(async () => {
    await deleteCliente(cliente.id);

    publicar("cliente_borrado", cliente.id);
  }, [publicar, cliente.id]);

  const cancelar_ = useCallback(
    () => publicar("borrado_cliente_cancelado"),
    [publicar]
  );

  const [borrar, cancelar] = useForm(borrar_, cancelar_);

  return (
    <QModalConfirmacion
      nombre="borrarCliente"
      abierto={true}
      titulo="Borrar cliente"
      mensaje={`¿Está seguro de que desea borrar este cliente?`}
      onCerrar={cancelar}
      onAceptar={borrar}
    />
  );
};
