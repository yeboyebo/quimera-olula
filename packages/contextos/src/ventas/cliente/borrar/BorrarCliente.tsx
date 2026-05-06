import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { useContext } from "react";
import { deleteCliente } from "../infraestructura.ts";

interface BorrarClienteProps {
  clienteId: string;
  clienteNombre: string;
  publicar?: ProcesarEvento;
  onCancelar?: () => void;
}

export const BorrarCliente = ({
  clienteId,
  clienteNombre,
  publicar = async () => {},
  onCancelar = () => {},
}: BorrarClienteProps) => {
  const { intentar } = useContext(ContextoError);

  const borrar = async () => {
    await intentar(() => deleteCliente(clienteId));
    publicar("borrado_de_cliente_listo", { clienteId });
    onCancelar();
  };

  return (
    <QModalConfirmacion
      nombre="borrarCliente"
      abierto={true}
      titulo="Confirmar borrar"
      mensaje={`¿Está seguro de que desea borrar el cliente "${clienteNombre}"?`}
      onCerrar={onCancelar}
      onAceptar={borrar}
    />
  );
};
