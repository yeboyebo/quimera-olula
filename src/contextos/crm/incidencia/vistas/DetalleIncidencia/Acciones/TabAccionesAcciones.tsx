import { QBoton } from "../../../../../../componentes/atomos/qboton.tsx";
import { QModal } from "../../../../../../componentes/moleculas/qmodal.tsx";
import { QModalConfirmacion } from "../../../../../../componentes/moleculas/qmodalconfirmacion.tsx";
import { HookModelo } from "../../../../../comun/useModelo.ts";
import { Accion } from "../../../../accion/diseño.ts";
import { Incidencia } from "../../../diseño.ts";
import { AltaAcciones } from "./AltaAcciones.tsx";

interface Props {
  seleccionada?: Accion | null;
  emitir: (evento: string, payload?: unknown) => void;
  estado: string;
  incidencia: HookModelo<Incidencia>;
}

export const TabAccionesAcciones = ({
  seleccionada,
  emitir,
  estado,
  incidencia,
}: Props) => {
  return (
    <div className="TabAccionesAcciones maestro-botones">
      <QBoton onClick={() => emitir("ALTA_SOLICITADA")}>Nueva</QBoton>
      <QBoton
        onClick={() => emitir("BORRADO_SOLICITADO")}
        deshabilitado={!seleccionada}
      >
        Borrar
      </QBoton>

      <QModal
        nombre="altaAccion"
        abierto={estado === "alta"}
        onCerrar={() => emitir("ALTA_CANCELADA")}
      >
        <AltaAcciones emitir={emitir} incidencia={incidencia} />
      </QModal>

      <QModalConfirmacion
        nombre="confirmarBorrarAccion"
        abierto={estado === "borrar"}
        titulo="Confirmar borrado"
        mensaje="¿Está seguro de que desea borrar esta acción?"
        onCerrar={() => emitir("BORRADO_CANCELADO")}
        onAceptar={() => emitir("ACCION_BORRADA")}
      />
    </div>
  );
};
