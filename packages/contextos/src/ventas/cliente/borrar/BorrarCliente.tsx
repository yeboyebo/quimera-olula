import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useContext } from "react";
import { Cliente } from "../diseño.ts";
import { deleteCliente } from "../infraestructura.ts";

interface BorrarClienteProps {
  cliente: Cliente;
  publicar?: EmitirEvento;
  onCancelar?: () => void;
}

export const BorrarCliente = ({
  cliente,
  publicar = () => {},
  onCancelar = () => {},
}: BorrarClienteProps) => {
  const { intentar } = useContext(ContextoError);

  const borrar = async () => {
    await intentar(() => deleteCliente(cliente.id));
    publicar("borrado_de_cliente_listo", { cliente });
    onCancelar();
  };

  return (
    <QModalConfirmacion
      nombre="borrarCliente"
      abierto={true}
      titulo="Confirmar borrar"
      mensaje={`¿Está seguro de que desea borrar el cliente "${cliente.nombre}"?`}
      onCerrar={onCancelar}
      onAceptar={borrar}
    />
  );
};
