import { QTabla } from "../../../../componentes/atomos/qtabla.tsx";
import { LineaPresupuesto as Linea } from "../diseño.ts";
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
    { id: "pvp_unitario", cabecera: "P. Unitario" },
    { id: "pvp_total", cabecera: "Total" },
  ];
};

export const LineasLista = ({
  lineas,
  seleccionada,
  publicar
}: {
  lineas: Linea[];
  seleccionada?: string;
  publicar: (evento: string, payload?: unknown) => void;
}) => {

  const cambiarCantidad = async (linea: Linea, cantidad: number) => {
    publicar("cambiar_cantidad", { linea, cantidad });
  };

  return (
    <>
      <QTabla
        metaTabla={getMetaTablaLineas(cambiarCantidad)}
        datos={lineas}
        cargando={false}
        seleccionadaId={seleccionada}
        onSeleccion={(linea) => publicar('linea_seleccionada', linea.id)}
        orden={{ id: "ASC" }}
        onOrdenar={
          (_: string) => null
          //   setOrden({ [clave]: orden[clave] === "ASC" ? "DESC" : "ASC" })
        }
      />
    </>
  );
};
