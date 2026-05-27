import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useContext } from "react";
import { Caja } from "../diseño.ts";
import { deleteCaja } from "../infraestructura.ts";

interface BorrarCajaProps {
  caja: Caja;
  activo?: boolean;
  publicar?: EmitirEvento;
  onCancelar?: () => void;
}

export const BorrarCaja = ({
  caja,
  activo = false,
  publicar = async () => {},
  onCancelar = () => {},
}: BorrarCajaProps) => {
  const { intentar } = useContext(ContextoError);

  const borrar = async () => {
    if (caja.id) {
      await intentar(() => deleteCaja(caja.id));
    }
    publicar("caja_borrada", { cajaId: caja.id });
    onCancelar();
  };

  return (
    <QModalConfirmacion
      nombre="confirmarBorrarCaja"
      abierto={activo}
      titulo="Confirmar borrado"
      mensaje={`¿Está seguro de que desea borrar la caja "${caja.id}"?`}
      onCerrar={onCancelar}
      onAceptar={borrar}
    />
  );
};
