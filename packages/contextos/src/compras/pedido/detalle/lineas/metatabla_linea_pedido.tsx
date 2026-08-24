import { MetaTabla } from "@olula/componentes/atomos/qtabla.tsx";
import { LineaPedido } from "../../diseño.ts";
import { etiquetaLinea } from "../../dominio.ts";

const porcentaje = (valor: number | null | undefined) => (valor ? `${valor}%` : "");

export const metaTablaLineaPedido = (divisa?: string): MetaTabla<LineaPedido> => [
    {
        id: "cerrada",
        cabecera: "",
        render: (linea: LineaPedido) => (linea.cerrada ? "🔒" : ""),
    },
    {
        id: "descripcion",
        cabecera: "Línea",
        prioridad: "alta",
        render: etiquetaLinea,
    },
    { id: "cantidad", cabecera: "Cantidad", tipo: "numero", prioridad: "alta" },
    {
        id: "cantidadRecibida",
        cabecera: "Recibida",
        tipo: "numero",
        prioridad: "media",
    },
    {
        id: "pvpUnitario",
        cabecera: "Coste",
        tipo: "moneda",
        divisa,
        prioridad: "alta",
    },
    {
        id: "dtoPorcentual",
        cabecera: "% Dto.",
        prioridad: "media",
        render: (linea: LineaPedido) => porcentaje(linea.dtoPorcentual),
    },
    {
        id: "dtoLineal",
        cabecera: "Dto. lineal",
        tipo: "moneda",
        divisa,
        prioridad: "baja",
    },
    {
        id: "grupoIvaProductoId",
        cabecera: "IVA",
        prioridad: "media",
    },
    {
        id: "tipoIrpf",
        cabecera: "% I.R.P.F.",
        prioridad: "baja",
        render: (linea: LineaPedido) => porcentaje(linea.tipoIrpf),
    },
    {
        id: "pvpTotal",
        cabecera: "Total",
        tipo: "moneda",
        divisa,
        prioridad: "alta",
    },
];
