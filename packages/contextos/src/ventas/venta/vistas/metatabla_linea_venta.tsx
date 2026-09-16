import { DetalleLineaExpandido } from "#/ventas/comun/componentes/DetalleLineaExpandido.tsx";
import { MetaTabla2 } from "@olula/componentes/atomos/qtablacontrolada.tsx";
import { LineaVenta } from "../diseño.ts";

const porcentaje = (valor: number | null | undefined) =>
  valor ? `${valor}%` : "";

/** Las líneas sin artículo de catálogo no tienen referencia: solo descripción. */
const etiquetaLinea = (linea: LineaVenta) =>
  linea.referencia ? `${linea.referencia}: ${linea.descripcion}` : linea.descripcion;

export const metaTablaLineaVenta = <L extends LineaVenta>(
  { divisa }: { divisa?: string } = {}
): MetaTabla2<L> => ({
  cols: [
    "linea",
    "cantidad",
    "pvp_unitario",
    "grupo_iva_producto_id",
    "dto_porcentual",
    "dto_lineal",
    "tipo_irpf",
    "tipo_recargo",
    "por_comision",
    "importe_comision",
    "pvp_total",
  ],
  metaCols: {
    linea: {
      id: "linea",
      cabecera: "Línea",
      prioridad: "alta",
      render: etiquetaLinea,
    },
    cantidad: {
      id: "cantidad",
      cabecera: "Cantidad",
      prioridad: "alta",
      tipo: "numero",
    },
    pvp_unitario: {
      id: "pvp_unitario",
      cabecera: "Precio",
      prioridad: "alta",
      tipo: "moneda",
      divisa,
    },
    grupo_iva_producto_id: {
      id: "grupo_iva_producto_id",
      cabecera: "IVA",
      prioridad: "media",
      render: (linea: L) => linea.grupo_iva_producto_id ?? "",
    },
    dto_porcentual: {
      id: "dto_porcentual",
      cabecera: "% Dto.",
      prioridad: "media",
      render: (linea: L) => porcentaje(linea.dto_porcentual),
    },
    dto_lineal: {
      id: "dto_lineal",
      cabecera: "Dto. lineal",
      prioridad: "baja",
      tipo: "moneda",
      divisa,
    },
    tipo_irpf: {
      id: "tipo_irpf",
      cabecera: "% I.R.P.F.",
      prioridad: "baja",
      render: (linea: L) => porcentaje(linea.tipo_irpf),
    },
    tipo_recargo: {
      id: "tipo_recargo",
      cabecera: "% R. Equiv.",
      prioridad: "baja",
      render: (linea: L) => porcentaje(linea.tipo_recargo),
    },
    por_comision: {
      id: "por_comision",
      cabecera: "% Comisión",
      prioridad: "baja",
      render: (linea: L) => porcentaje(linea.por_comision),
    },
    importe_comision: {
      id: "importe_comision",
      cabecera: "Comisión",
      prioridad: "baja",
      tipo: "moneda",
      divisa,
    },
    pvp_total: {
      id: "pvp_total",
      cabecera: "Total",
      prioridad: "alta",
      tipo: "moneda",
      divisa,
    },
  },
});

export const metaTablaLineaVentaResumida = <L extends LineaVenta>(
  opciones: { divisa?: string } = {}
): MetaTabla2<L> => {
  const meta = metaTablaLineaVenta<L>(opciones);
  return {
    cols: meta.cols.filter((id) => meta.metaCols[id]?.prioridad !== "baja"),
    metaCols: meta.metaCols,
    expansion: ({ entidad }) => (
      <DetalleLineaExpandido linea={entidad} divisa={opciones.divisa} />
    ),
  };
};
