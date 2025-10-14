import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { Presupuesto } from "../../../../../ventas/presupuesto/diseño.ts";
import { OportunidadVenta } from "../../../diseño.ts";

interface Props {
  seleccionada?: Presupuesto | null;
  emitir: (evento: string, payload?: unknown) => void;
  estado: string;
  oportunidad: HookModelo<OportunidadVenta>;
}

export const TabPresupuestosAcciones = ({
  seleccionada,
  emitir,
  estado,
  oportunidad,
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

      <QModalConfirmacion
        nombre="altaPresupuesto"
        abierto={estado === "alta"}
        titulo="Crear Presupuesto"
        mensaje={
          "¿Desea crear un nuevo presupuesto para el cliente " +
          oportunidad.modelo.nombre_cliente +
          "?"
        }
        onCerrar={() => emitir("ALTA_CANCELADA")}
        onAceptar={() => emitir("CREAR_PRESUPUESTO")}
      ></QModalConfirmacion>

      <QModalConfirmacion
        nombre="confirmarBorrarAccion"
        abierto={estado === "borrar"}
        titulo="Confirmar borrado"
        mensaje="¿Está seguro de que desea borrar esta acción?"
        onCerrar={() => emitir("BORRADO_CANCELADO")}
        onAceptar={() => emitir("PRESUPUESTO_BORRADO")}
      />
    </div>
  );
};
