import { QTabla } from "@olula/componentes/atomos/qtabla.tsx";
import { LineaPresupuesto as Linea } from "../../../diseño.ts";
import { EditarCantidadLinea } from "./EditarCantidadLinea.tsx";

export const LineasLista = ({
  lineas,
  seleccionada,
  publicar,
  onCambioCantidad,
  presupuestoEditable,
}: {
  lineas: Linea[];
  seleccionada?: string;
  publicar: (evento: string, payload?: unknown) => void;
  onCambioCantidad?: (linea: Linea, cantidad: number) => void;
  presupuestoEditable?: boolean;
}) => {
  const setSeleccionada = (linea: Linea) => {
    publicar("linea_seleccionada", linea);
  };

  return (
    <>
      <QTabla
        metaTabla={getMetaTablaLineas(onCambioCantidad, presupuestoEditable)}
        datos={lineas}
        cargando={false}
        seleccionadaId={seleccionada}
        onSeleccion={setSeleccionada}
        orden={["id", "ASC"]}
        onOrdenar={(_: string) => null}
      />
    </>
  );
};

const getMetaTablaLineas = (
  onCambioCantidad?: (linea: Linea, cantidad: number) => void,
  presupuestoEditable?: boolean
) => {
  return [
    {
      id: "linea",
      cabecera: "Línea",
      render: (linea: Linea) => `${linea.referencia}: ${linea.descripcion}`,
    },
    {
      id: "cantidad",
      cabecera: "Cantidad",
      render: (linea: Linea) =>
        presupuestoEditable && onCambioCantidad ? (
          <EditarCantidadLinea
            linea={linea}
            onCantidadEditada={onCambioCantidad}
          />
        ) : (
          <span>{linea.cantidad}</span>
        ),
    },
    {
      id: "pvp_unitario",
      cabecera: "Precio",
    },
    {
      id: "grupo_iva_producto_id",
      cabecera: "IVA",
    },
    {
      id: "dto_porcentual",
      cabecera: "% Dto.",
      render: (linea: Linea) =>
        linea.dto_porcentual ? `${linea.dto_porcentual}%` : "",
    },
    {
      id: "pvp_total",
      cabecera: "Total",
      tipo: "moneda" as const,
    },
  ];
};
