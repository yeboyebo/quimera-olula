import { QTabla } from "@olula/componentes/atomos/qtabla.tsx";
import { ContextoError } from "@olula/lib/contexto.js";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useContext } from "react";
import { LineaFactura as Linea } from "../../../diseño.ts";
import { patchCantidadLinea } from "../../../infraestructura.ts";

export const LineasLista = ({
  lineas,
  seleccionada,
  emitir,
  idFactura,
  refrescarCabecera,
}: {
  lineas: Linea[];
  seleccionada?: string;
  emitir: EmitirEvento;
  idFactura: string;
  refrescarCabecera: () => void;
}) => {
  const { intentar } = useContext(ContextoError);
  const cambiarCantidad = async (linea: Linea, cantidad: number) => {
    await intentar(() => patchCantidadLinea(idFactura, linea, cantidad));
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

export const LineaVenta = ({
  linea,
  // seleccionada,
  // emitir,
  // idFactura,
  // refrescarCabecera,
}: {
  linea: Linea;
  // seleccionada?: string;
  // emitir: EmitirEvento;
  // idFactura: string;
  // refrescarCabecera: () => void;
}) => {
  // const { intentar } = useContext(ContextoError);
  // const cambiarCantidad = async (linea: Linea, cantidad: number) => {
  //   await intentar(() => patchCantidadLinea(idFactura, linea, cantidad));
  //   refrescarCabecera();
  // };

  // const setSeleccionada = (linea: Linea) => {
  //   emitir("linea_seleccionada", linea);
  // };

  return (
    <>
      {`${linea.referencia}: ${linea.descripcion}. ${linea.cantidad} x ${linea.pvp_unitario}€ = ${linea.pvp_total}€ ${
        linea.dto_porcentual ? `(Descuento ${linea.dto_porcentual}%)` : ""
      }`}
    </>
  );
};

const getMetaTablaLineas = (
  cambiarCantidad: (linea: Linea, cantidad: number) => void
) => {
  return [
    {
      id: "linea",
      cabecera: "Lineas",
      render: (linea: Linea) => (
        <LineaVenta
          linea={linea}
          // onCantidadEditada={cambiarCantidad}
        />
      ),
    },
    // { id: "pvp_unitario", cabecera: "Precio" },
    // { id: "grupo_iva_producto_id", cabecera: "IVA" },
    // {
    //   id: "dto_porcentual",
    //   cabecera: "% Dto.",
    //   render: (linea: Linea) =>
    //     linea.dto_porcentual ? `${linea.dto_porcentual}%` : "",
    // },
    // { id: "pvp_total", cabecera: "Total" },
  ];
  // return [
  //   {
  //     id: "linea",
  //     cabecera: "Línea",
  //     render: (linea: Linea) => `${linea.referencia}: ${linea.descripcion}`,
  //   },
  //   {
  //     id: "cantidad",
  //     cabecera: "Cantidad",
  //     render: (linea: Linea) => (
  //       <EditarCantidadLinea
  //         linea={linea}
  //         onCantidadEditada={cambiarCantidad}
  //       />
  //     ),
  //   },
  //   { id: "pvp_unitario", cabecera: "Precio" },
  //   { id: "grupo_iva_producto_id", cabecera: "IVA" },
  //   {
  //     id: "dto_porcentual",
  //     cabecera: "% Dto.",
  //     render: (linea: Linea) =>
  //       linea.dto_porcentual ? `${linea.dto_porcentual}%` : "",
  //   },
  //   { id: "pvp_total", cabecera: "Total" },
  // ];
};
