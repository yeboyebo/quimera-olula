import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { useContext } from "react";
import { Ubicacion } from "../../diseño.ts";
import { deleteUbicacion } from "../../infraestructura.ts";

export const BorrarUbicacion = ({
  publicar,
  activo = false,
  ubicacion,
}: {
  publicar: (evento: string, payload?: unknown) => void;
  ubicacion: Ubicacion;
  activo: boolean;
}) => {
  const { intentar } = useContext(ContextoError);

  const borrar = async () => {
    if (ubicacion.id) {
      await intentar(() => deleteUbicacion(ubicacion.id));
    }
    publicar("ubicacion_borrada");
  };

  return (
    <QModalConfirmacion
      nombre="confirmarBorrarUbicacion"
      abierto={activo}
      titulo="Confirmar borrado"
      mensaje="¿Está seguro de que desea borrar esta ubicación?"
      onCerrar={() => publicar("borrado_cancelado")}
      onAceptar={borrar}
    />
  );
};
