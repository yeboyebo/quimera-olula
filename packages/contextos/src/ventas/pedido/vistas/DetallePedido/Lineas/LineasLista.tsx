import { QTabla } from "@olula/componentes/atomos/qtabla.tsx";
import { ContextoError } from "@olula/lib/contexto.js";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useContext } from "react";
import { LineaPedido as Linea } from "../../../diseño.ts";
import { patchCantidadLinea } from "../../../infraestructura.ts";
import { EditarCantidadLinea } from "./EditarCantidadLinea.tsx";

export const LineasLista = ({
  lineas,
  seleccionada,
  emitir,
  idPedido,
  refrescarCabecera,
}: {
  lineas: Linea[];
  seleccionada?: string;
  emitir: EmitirEvento;
  idPedido: string;
  refrescarCabecera: () => void;
}) => {
  const { intentar } = useContext(ContextoError);
  const cambiarCantidad = async (linea: Linea, cantidad: number) => {
    await intentar(() => patchCantidadLinea(idPedido, linea, cantidad));
    refrescarCabecera();
  };

  const setSeleccionada = (linea: Linea) => {
    emitir("linea_seleccionada", linea);
  };

  return (
    <>
      <QTabla
        metaTabla={getMetaTablaLineas(cambiarCantidad)}
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
        <EditarCantidadLinea
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
