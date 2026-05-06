import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { useContext } from "react";
import { Albaran } from "../diseño.ts";
import { borrarAlbaran } from "../infraestructura.ts";

export const BorrarAlbaran = ({
  publicar,
  albaran,
}: {
  publicar: (evento: string, payload?: unknown) => void;
  albaran: Albaran;
}) => {
  const { intentar } = useContext(ContextoError);

  const borrar = async () => {
    if (albaran.id) {
      await intentar(() => borrarAlbaran(albaran.id));
    }
    publicar("borrado_de_albaran_listo");
  };

  return (
    <QModalConfirmacion
      nombre="confirmarBorrarAlbaran"
      abierto={true}
      titulo="Confirmar borrar"
      mensaje="¿Está seguro de que desea borrar este albarán?"
      onCerrar={() => publicar("borrar_cancelado")}
      onAceptar={borrar}
    />
  );
};
