import { Entidad } from "@olula/lib/diseño.ts";
import { MaestroDetalleControladoProps } from "./diseño.tsx";
import "./MaestroDetalleControlado.css";
import { useEsMovil } from "./useEsMovil.ts";

type MaestroDetalleActivoControladoProps<T extends Entidad> = Omit<
  MaestroDetalleControladoProps<T>,
  "seleccionada"
> & {
  seleccionada?: string;
};

export function MaestroDetalleActivoControlado<T extends Entidad>(
  props: MaestroDetalleActivoControladoProps<T>
) {
  const { seleccionada, Maestro, Detalle, layout = "TARJETA" } = props;

  const esMovil = useEsMovil();

  const [claseMaestro, claseDetalle] = esMovil
    ? layout === "TARJETA"
      ? seleccionada
        ? ["MaestroTarjetaMovilSeleccionada", "DetalleTarjetaMovilSeleccionada"]
        : ["MaestroTarjetaMovil", "DetalleTarjetaMovil"]
      : seleccionada
        ? ["MaestroTablaMovilSeleccionada", "DetalleTablaMovilSeleccionada"]
        : ["MaestroTablaMovil", "DetalleTablaMovil"]
    : layout === "TARJETA"
      ? seleccionada
        ? ["MaestroTarjetaSeleccionada", "DetalleTarjetaSeleccionada"]
        : ["MaestroTarjeta", "DetalleTarjeta"]
      : seleccionada
        ? ["MaestroTablaSeleccionada", "DetalleTablaSeleccionada"]
        : ["MaestroTabla", "DetalleTabla"];

  return (
    <maestro-detalle tipo={"maestro-dinamico"}>
      <div className={claseMaestro}>{Maestro}</div>
      <div className={claseDetalle}>{Detalle}</div>
    </maestro-detalle>
  );
}
