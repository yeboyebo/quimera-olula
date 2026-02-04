import { QModalConfirmacion } from "@olula/componentes/index.js";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useContext } from "react";
import { Usuario } from "../diseño.ts";
import { deleteUsuario } from "../infraestructura.ts";

export const BorrarUsuario = ({
  usuario,
  abierto = false,
  publicar = async () => {},
}: {
  usuario: Usuario | null;
  abierto: boolean;
  publicar?: EmitirEvento;
}) => {
  const { intentar } = useContext(ContextoError);

  const borrar = async () => {
    if (!usuario) return;

    await intentar(() => deleteUsuario(usuario.id));
    publicar("borrado_de_usuario_listo");
  };

  const cancelar = () => {
    publicar("borrado_cancelado");
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
