import { Entidad } from "@olula/lib/diseño.ts";
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
    layout = "TARJETA",
    modoDisposicion,
  } = props;

  const haySeleccion = !!seleccionada;
  const tipoLayout =
    modoDisposicion ??
    (layout === "TABLA" ? "pantalla-completa" : "maestro-dinamico");
  const tipo = tipoLayout === "modal" ? "pantalla-completa" : tipoLayout;
  const esDosPaneles = tipo === "maestro-dinamico" || tipo === "maestro-50";

  const claseMaestro = [
    "Maestro",
    esDosPaneles && haySeleccion ? "contraido" : "",
    tipo === "pantalla-completa" && haySeleccion ? "oculto" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const claseDetalle = [
    "Detalle",
    esDosPaneles && haySeleccion ? "expandido" : "",
    tipo === "pantalla-completa" && !haySeleccion ? "oculto" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <maestro-detalle tipo={tipo}>
      <div className={claseMaestro}>{Maestro}</div>
      <div className={claseDetalle}>{Detalle}</div>
    </maestro-detalle>
  );
}
