import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { useContext } from "react";
import { Familia } from "../../diseño.ts";
import { deleteFamilia } from "../../infraestructura.ts";

export const BorrarFamilia = ({
  publicar,
  activo = false,
  familia,
}: {
  publicar: (evento: string, payload?: unknown) => void;
  familia: Familia;
  activo: boolean;
}) => {
  const { intentar } = useContext(ContextoError);

  const borrar = async () => {
    if (familia.id) {
      await intentar(() => deleteFamilia(familia.id));
    }
    publicar("familia_borrada");
  };

  return (
    <QModalConfirmacion
      nombre="confirmarBorrarFamilia"
      abierto={activo}
      titulo="Confirmar borrado"
      mensaje="¿Está seguro de que desea borrar esta familia?"
      onCerrar={() => publicar("borrado_cancelado")}
      onAceptar={borrar}
    />
  );
};
