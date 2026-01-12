import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.js";

export const ReabrirArqueoTpv = ({
  publicar,
}: {
  publicar: EmitirEvento;
}) => {

  return (
    <QModalConfirmacion
      nombre="confirmarReabrirArqueo"
      abierto={true}
      titulo="Reabrir arqueo"
      mensaje="¿Está seguro de que desea reabrir el arqueo?"
      onCerrar={() => publicar("reapertura_cancelada")}
      onAceptar={() => publicar("reapertura_lista")}
    />
  );
};
