import { useContext } from "react";
import { QModalConfirmacion } from "../../../../../../src/componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "../../../../../../src/contextos/comun/contexto.ts";
import { Usuario } from "../../diseño";
import { deleteUsuario } from "../../infraestructura";

export const BorrarUsuario = ({
  emitir,
  activo = false,
  usuario,
}: {
  emitir: (evento: string, payload?: unknown) => void;
  usuario: Usuario;
  activo: boolean;
}) => {
  const { intentar } = useContext(ContextoError);

  const borrar = async () => {
    if (usuario.id) {
      await intentar(() => deleteUsuario(usuario.id));
    }
    emitir("usuario_borrado");
  };

  return (
    <QModalConfirmacion
      nombre="confirmarBorrarUsuario"
      abierto={activo}
      titulo="Confirmar borrado"
      mensaje="¿Está seguro de que desea borrar este usuario?"
      onCerrar={() => emitir("borrado_cancelado")}
      onAceptar={borrar}
    />
  );
};
