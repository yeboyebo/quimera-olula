import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { useContext } from "react";
import { Almacen } from "../../diseño.ts";
import { deleteAlmacen } from "../../infraestructura.ts";

export const BorrarAlmacen = ({
  emitir,
  activo = false,
  almacen,
}: {
  emitir: (evento: string, payload?: unknown) => void;
  almacen: Almacen;
  activo: boolean;
}) => {
  const { intentar } = useContext(ContextoError);

  const borrar = async () => {
    if (almacen.id) {
      await intentar(() => deleteAlmacen(almacen.id));
    }
    emitir("modulo_borrado");
  };

  return (
    <QModalConfirmacion
      nombre="confirmarBorrarAlmacen"
      abierto={activo}
      titulo="Confirmar borrado"
      mensaje="¿Está seguro de que desea borrar este módulo?"
      onCerrar={() => emitir("borrado_cancelado")}
      onAceptar={borrar}
    />
  );
};
