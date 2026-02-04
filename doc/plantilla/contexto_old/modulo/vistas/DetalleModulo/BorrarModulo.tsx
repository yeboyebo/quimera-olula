import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { useContext } from "react";
import { Modulo } from "../../diseño";
import { deleteModulo } from "../../infraestructura";

export const BorrarModulo = ({
  emitir,
  activo = false,
  modulo,
}: {
  emitir: (evento: string, payload?: unknown) => void;
  modulo: Modulo;
  activo: boolean;
}) => {
  const { intentar } = useContext(ContextoError);

  const borrar = async () => {
    if (modulo.id) {
      await intentar(() => deleteModulo(modulo.id));
    }
    emitir("modulo_borrado");
  };

  return (
    <QModalConfirmacion
      nombre="confirmarBorrarModulo"
      abierto={activo}
      titulo="Confirmar borrado"
      mensaje="¿Está seguro de que desea borrar este módulo?"
      onCerrar={() => emitir("borrado_cancelado")}
      onAceptar={borrar}
    />
  );
};
