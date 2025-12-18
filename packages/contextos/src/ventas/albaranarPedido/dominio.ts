import { MetaTabla } from "@olula/componentes/index.js";
import { LineaPedido as Linea } from "../pedido/diseño.ts";
import { LineaAlbaranarPedido, LineasAlabaranPatch, Tramo } from "./diseño.ts";

export const metaTablaLineaPedido: MetaTabla<Linea> = [
    {
        id: "linea",
        cabecera: "Línea",
        render: (linea: Linea) => `${linea.referencia}: ${linea.descripcion}`,
    },
    {
        id: "cantidad",
        cabecera: "Cantidad"
    },
];

export const metaTablaTramoLineaPedido: MetaTabla<Tramo> = [
    {
        id: "lote_id",
        cabecera: "Lote ID"
    },
    {
        id: "ubicacion_id",
        cabecera: "Ubicación ID"
    },
    {
        id: "cantidad",
        cabecera: "Cantidad"
    },
    {
        id: "cantidad_ko",
        cabecera: "Cantidad KO"
    },
];

export const transformarLineasAlbaran = (lineas: LineaAlbaranarPedido[]): LineasAlabaranPatch[] => {
    return lineas.map(linea => ({
        id: linea.id,
        cantidad: linea.servida || 0,
        lotes: []
    }));
}