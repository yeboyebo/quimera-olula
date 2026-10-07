import { Entidad } from "@olula/lib/diseño.ts";
import { QModal } from "../moleculas/qmodal.tsx";
import { useControlPantalla } from "@olula/lib/controles_pantalla.ts";
import { MaestroDetalleProps as MaestroDetalleBaseProps } from "./diseño.tsx";
import "./MaestroDetalle.css";

type MaestroDetalleConIdProps<T extends Entidad> = Omit<
  MaestroDetalleBaseProps<T>,
  "seleccionada"
> & {
  seleccionada?: string;
};

export function MaestroDetalle<T extends Entidad>(
  props: MaestroDetalleConIdProps<T>
) {
  const {
    seleccionada,
    Maestro,
    Detalle,
    nombreModal = "detalle",
    onCerrarDetalle,
    layout = "TARJETA",
    modoDisposicion,
  } = props;

  const haySeleccion = !!seleccionada;

  // "Cierra el detalle" por voz / desde el asistente (ver controles_pantalla.ts). En
  // disposición modal ya lo cubre el propio QModal.
  useControlPantalla("detalle", () => ({
    describir: () => ({ tipo: "detalle", id: "" }),
    ejecutar: (accion) => {
      if (accion !== "cerrar" || !onCerrarDetalle) return { ok: false, mensaje: "No puedo cerrar este detalle." };
      onCerrarDetalle();
      return { ok: true, mensaje: "Detalle cerrado." };
    },
  }), haySeleccion && !!onCerrarDetalle && modoDisposicion !== "modal");
  const tipoLayout =
    modoDisposicion ??
    (layout === "TABLA" ? "pantalla-completa" : "maestro-dinamico");
  const esModal = tipoLayout === "modal";
  const tipo = esModal ? "pantalla-completa" : tipoLayout;
  const esDosPaneles = tipo === "maestro-dinamico" || tipo === "maestro-50";

  const claseMaestro = [
    "Maestro",
    esDosPaneles && haySeleccion ? "contraido" : "",
    tipo === "pantalla-completa" && haySeleccion && !esModal ? "oculto" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const claseDetalle = [
    "Detalle",
    esDosPaneles && haySeleccion ? "expandido" : "",
    tipo === "pantalla-completa" && !haySeleccion ? "oculto" : "",
    esModal ? "oculto" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <maestro-detalle tipo={tipo}>
      <div className={claseMaestro}>{Maestro}</div>
      <div className={claseDetalle}>{esModal ? null : Detalle}</div>
      {esModal && (
        <QModal
          nombre={nombreModal}
          abierto={haySeleccion}
          onCerrar={onCerrarDetalle}
          mostrarCabecera={false}
          anchoEstable
        >
          {Detalle}
        </QModal>
      )}
    </maestro-detalle>
  );
}
