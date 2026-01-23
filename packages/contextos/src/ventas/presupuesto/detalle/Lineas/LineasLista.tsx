import { QTablaControlada } from "@olula/componentes/atomos/qtablacontrolada.tsx";
import { Orden } from "@olula/lib/diseño.ts";
import { publicar } from "@olula/lib/dominio.js";
import { LineaPresupuesto as Linea } from "../../diseño.ts";
import { EditarCantidadLinea } from "./EditarCantidadLinea.tsx";

export const LineasLista = ({
  lineas,
  seleccionada,
  onCambioCantidad,
  presupuestoEditable,
}: {
  lineas: Linea[];
  seleccionada?: string;
  onCambioCantidad?: (linea: Linea, cantidad: number) => void;
  presupuestoEditable?: boolean;
}) => {
  const setSeleccionada = (linea: Linea) => {
    publicar("linea_seleccionada", linea);
  };

  const ordenPorDefecto: Orden = ["id", "ASC"];

  return (
    <>
      <QTablaControlada
        metaTabla={getMetaTablaLineas(onCambioCantidad, presupuestoEditable)}
        datos={lineas}
        cargando={false}
        seleccionadaId={seleccionada}
        onSeleccion={setSeleccionada}
        orden={ordenPorDefecto}
        onOrdenChanged={() => null}
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
