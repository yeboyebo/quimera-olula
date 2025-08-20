import { useContext } from "react";
import { QModalConfirmacion } from "../../../../../componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "../../../../comun/contexto.ts";
import { Incidencia } from "../../diseño.ts";
import { deleteIncidencia } from "../../infraestructura.ts";

export const BorrarIncidencia = ({
  publicar,
  activo = false,
  incidencia
}: {
  publicar: (evento: string, payload?: unknown) => void;
  incidencia: Incidencia;
  activo: boolean;
}) => {

  const { intentar } = useContext(ContextoError);
  
  const borrar = async () => {
    if (incidencia.id) {
      await intentar(() => deleteIncidencia(incidencia.id));
    }
    publicar("incidencia_borrada");
  };
  
  return (
    <QModalConfirmacion
        nombre="confirmarBorrarIncidencia"
        abierto={activo}
        titulo="Confirmar borrado"
        mensaje="¿Está seguro de que desea borrar esta incidencia?"
        onCerrar={() => publicar("borrado_cancelado")}
        onAceptar={borrar}
      />
  );
}