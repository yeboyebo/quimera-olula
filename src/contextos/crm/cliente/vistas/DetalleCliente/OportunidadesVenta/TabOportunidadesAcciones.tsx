import { QBoton } from "../../../../../../componentes/atomos/qboton.tsx";
import { QModal } from "../../../../../../componentes/moleculas/qmodal.tsx";
import { QModalConfirmacion } from "../../../../../../componentes/moleculas/qmodalconfirmacion.tsx";
import { OportunidadVenta } from "../../../../oportunidadventa/diseño.ts";

export const TabOportunidadesAcciones = ({
  seleccionada,
  emitir,
  estado,
}: {
  seleccionada: OportunidadVenta | null;
  emitir: (evento: string, payload?: unknown) => void;
  estado: string;
  clienteId: string;
}) => {
  return (
    <div className="botones maestro-botones">
      <QBoton onClick={() => emitir("ALTA_SOLICITADA")}>Nueva</QBoton>
      <QBoton
        onClick={() => seleccionada && emitir("EDICION_SOLICITADA")}
        deshabilitado={!seleccionada}
      >
        Editar
      </QBoton>
      <QBoton
        onClick={() => emitir("BORRADO_SOLICITADO")}
        deshabilitado={!seleccionada}
      >
        Borrar
      </QBoton>
      <QModal
        nombre="altaOportunidad"
        abierto={estado === "alta"}
        onCerrar={() => emitir("ALTA_CANCELADA")}
      >
        <h2 className="titulo-modal">Nueva oportunidad</h2>
        {/* <AltaOportunidad emitir={emitir} /> */}
      </QModal>
      <QModalConfirmacion
        nombre="borrarOportunidad"
        abierto={estado === "borrar"}
        titulo="¿Borrar oportunidad?"
        mensaje="¿Está seguro de que desea borrar esta oportunidad?"
        onCerrar={() => emitir("BORRADO_CANCELADO")}
        onAceptar={() => emitir("OPORTUNIDAD_BORRADA")}
      />
    </div>
  );
};
