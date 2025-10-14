import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { useContext } from "react";
import { EstadoOportunidad } from "../../diseño.ts";
import { deleteEstadoOportunidad } from "../../infraestructura.ts";

export const BorrarEstadoOportunidad = ({
  publicar,
  activo = false,
  EstadoOportunidad,
}: {
  publicar: (evento: string, payload?: unknown) => void;
  EstadoOportunidad: EstadoOportunidad;
  activo: boolean;
}) => {
  const { intentar } = useContext(ContextoError);

  const borrar = async () => {
    if (EstadoOportunidad.id) {
      await intentar(() => deleteEstadoOportunidad(EstadoOportunidad.id));
    }
    publicar("estado_oportunidad_borrado");
  };

  return (
    <QModalConfirmacion
      nombre="confirmarBorrarEstadoOportunidad"
      abierto={activo}
      titulo="Confirmar borrado"
      mensaje="¿Está seguro de que desea borrar este estado?"
      onCerrar={() => publicar("borrado_cancelado")}
      onAceptar={borrar}
    />
  );
};
