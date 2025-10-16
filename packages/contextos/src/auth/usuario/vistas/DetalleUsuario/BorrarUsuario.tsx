import { QModalConfirmacion } from "@olula/componentes/index.ts";
import { ContextoError } from "@olula/lib/contexto.ts";
import { useContext } from "react";
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
    emitir("borrado_cancelado");
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
