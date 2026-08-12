import { MetaTabla } from "@olula/componentes/atomos/qtabla.tsx";
import { ReactNode } from "react";
import { LineaVenta } from "../diseño.ts";

export type OpcionesMetaTablaLineaVenta<L extends LineaVenta> = {
  divisa?: string;
  renderCantidad?: (linea: L) => ReactNode;
};

const porcentaje = (valor: number | null | undefined) =>
  valor ? `${valor}%` : "";

export const metaTablaLineaVenta = <L extends LineaVenta>({
  divisa,
  renderCantidad,
}: OpcionesMetaTablaLineaVenta<L> = {}): MetaTabla<L> => [
  {
    id: "linea",
    cabecera: "Línea",
    prioridad: "alta" as const,
    render: (linea: L) => `${linea.referencia}: ${linea.descripcion}`,
  },
  {
    id: "cantidad",
    cabecera: "Cantidad",
    prioridad: "alta" as const,
    tipo: "numero" as const,
    render: (linea: L) =>
      renderCantidad ? renderCantidad(linea) : <span>{linea.cantidad}</span>,
  },
  {
    id: "pvp_unitario",
    cabecera: "Precio",
    prioridad: "alta" as const,
    tipo: "moneda" as const,
    divisa,
  },
  {
    id: "grupo_iva_producto_id",
    cabecera: "IVA",
    prioridad: "media" as const,
    render: (linea: L) => linea.grupo_iva_producto_id ?? "",
  },
  {
    id: "dto_porcentual",
    cabecera: "% Dto.",
    prioridad: "media" as const,
    render: (linea: L) => porcentaje(linea.dto_porcentual),
  },
  {
    id: "dto_lineal",
    cabecera: "Dto. lineal",
    prioridad: "baja" as const,
    tipo: "moneda" as const,
    divisa,
  },
  {
    id: "tipo_irpf",
    cabecera: "% I.R.P.F.",
    prioridad: "baja" as const,
    render: (linea: L) => porcentaje(linea.tipo_irpf),
  },
  {
    id: "tipo_recargo",
    cabecera: "% R. Equiv.",
    prioridad: "baja" as const,
    render: (linea: L) => porcentaje(linea.tipo_recargo),
  },
  {
    id: "por_comision",
    cabecera: "% Comisión",
    prioridad: "baja" as const,
    render: (linea: L) => porcentaje(linea.por_comision),
  },
  {
    id: "importe_comision",
    cabecera: "Comisión",
    prioridad: "baja" as const,
    tipo: "moneda" as const,
    divisa,
  },
  {
    id: "pvp_total",
    cabecera: "Total",
    prioridad: "alta" as const,
    tipo: "moneda" as const,
    divisa,
  },
];
