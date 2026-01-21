import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useContext } from "react";
import { DirCliente } from "../diseño.ts";
import { deleteDireccion } from "../infraestructura.ts";

interface BorrarDireccionProps {
  direccion: DirCliente;
  clienteId: string;
  publicar?: EmitirEvento;
  onCancelar?: () => void;
}

export const BorrarDireccion = ({
  direccion,
  clienteId,
  publicar = () => {},
  onCancelar = () => {},
}: BorrarDireccionProps) => {
  const { intentar } = useContext(ContextoError);

  const borrar = async () => {
    await intentar(() => deleteDireccion(clienteId, direccion.id));
    publicar("borrado_confirmado", { direccion });
    onCancelar();
  };

  return (
    <QModalConfirmacion
      nombre="borrarDireccion"
      abierto={true}
      titulo="Confirmar borrar"
      mensaje={`¿Está seguro de que desea borrar la dirección "${direccion.nombre_via}"?`}
      onCerrar={onCancelar}
      onAceptar={borrar}
    />
  );
};
