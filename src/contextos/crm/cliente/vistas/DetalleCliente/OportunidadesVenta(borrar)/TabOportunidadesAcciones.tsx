import { QBoton } from "../../../../../../componentes/atomos/qboton.tsx";
import { QModal } from "../../../../../../componentes/moleculas/qmodal.tsx";
import { QModalConfirmacion } from "../../../../../../componentes/moleculas/qmodalconfirmacion.tsx";
import { HookModelo } from "../../../../../comun/useModelo.ts";
import { OportunidadVenta } from "../../../../oportunidadventa/diseño.ts";
import { Cliente } from "../../../diseño.ts";
import { AltaOportunidadVenta } from "./AltaOportunidadVenta.tsx";

export const TabOportunidadesAcciones = ({
  seleccionada,
  emitir,
  estado,
  cliente,
}: {
  seleccionada: OportunidadVenta | null;
  emitir: (evento: string, payload?: unknown) => void;
  estado: string;
  cliente: HookModelo<Cliente>;
}) => {
  return (
    <div className="botones maestro-botones">
      <QBoton onClick={() => emitir("ALTA_SOLICITADA")}>Nueva</QBoton>
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
        <AltaOportunidadVenta emitir={emitir} cliente={cliente} />
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
