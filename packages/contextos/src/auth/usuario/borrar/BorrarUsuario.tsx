import { QModalConfirmacion } from "@olula/componentes/index.js";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useContext } from "react";
import { Usuario } from "../diseño.ts";
import { deleteUsuario } from "../infraestructura.ts";

export const BorrarUsuario = ({
  usuario,
  abierto = false,
  emitir = async () => {},
}: {
  usuario: Usuario | null;
  abierto: boolean;
  emitir?: EmitirEvento;
}) => {
  const { intentar } = useContext(ContextoError);

  const borrar = async () => {
    if (!usuario) return;

    await intentar(() => deleteUsuario(usuario.id));
    emitir("usuario_borrado", usuario);
  };

  const cancelar = () => {
    emitir("borrado_cancelado");
  };

  return (
    <QModalConfirmacion
      nombre="borrarUsuario"
      abierto={abierto}
      titulo="Confirmar borrado"
      mensaje={`¿Está seguro de que desea borrar el usuario "${usuario?.nombre}"?`}
      onCerrar={cancelar}
      onAceptar={borrar}
      labelAceptar="Borrar"
    />
  );
};
