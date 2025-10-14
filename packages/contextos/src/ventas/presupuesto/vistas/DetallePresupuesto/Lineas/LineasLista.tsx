import { QTabla } from "@olula/componentes/atomos/qtabla.tsx";
import { LineaPresupuesto as Linea } from "../../../diseño.ts";
import { EditarCantidadLineaPresupuesto } from "./EditarCantidadLineaPresupuesto.tsx";

const getMetaTablaLineas = (
  cambiarCantidad: (linea: Linea, cantidad: number) => void
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
      render: (linea: Linea) => (
        <EditarCantidadLineaPresupuesto
          linea={linea}
          onCantidadEditada={cambiarCantidad}
        />
      ),
    },
    { id: "pvp_unitario", cabecera: "Precio" },
    { id: "grupo_iva_producto_id", cabecera: "IVA" },
    {
      id: "dto_porcentual",
      cabecera: "% Dto.",
      render: (linea: Linea) =>
        linea.dto_porcentual ? `${linea.dto_porcentual}%` : "",
    },
    { id: "pvp_total", cabecera: "Total" },
  ];
};

export const LineasLista = ({
  lineas,
  seleccionada,
  emitir,
}: {
  lineas: Linea[];
  seleccionada?: string;
  emitir: (evento: string, payload?: unknown) => void;
}) => {
  const cambiarCantidad = async (linea: Linea, cantidad: number) => {
    emitir("CAMBIO_CANTIDAD_SOLICITADO", { linea, cantidad });
  };

  return (
    <>
      <QTabla
        metaTabla={getMetaTablaLineas(cambiarCantidad)}
        datos={lineas}
        cargando={false}
        seleccionadaId={seleccionada}
        onSeleccion={(linea) => emitir("LINEA_SELECCIONADA", linea)}
        orden={["id", "ASC"]}
        onOrdenar={
          (_: string) => null
          //   setOrden({ [clave]: orden[clave] === "ASC" ? "DESC" : "ASC" })
        }
      />
    </>
  );
};
