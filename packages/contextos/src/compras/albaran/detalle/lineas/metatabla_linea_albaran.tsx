import { QIcono } from "@olula/componentes/atomos/qicono.tsx";
import { MetaTabla } from "@olula/componentes/atomos/qtabla.tsx";
import { LineaAlbaran } from "../../diseño.ts";
import { etiquetaLinea, lineaDePedido } from "../../dominio.ts";

const porcentaje = (valor: number | null | undefined) => (valor ? `${valor}%` : "");

export const metaTablaLineaAlbaran = (divisa?: string): MetaTabla<LineaAlbaran> => [
    {
        id: "pedidoId",
        cabecera: "",
        // Marca las líneas que vienen de un pedido: cambiarlas reajusta lo recibido.
        render: (linea: LineaAlbaran) =>
            lineaDePedido(linea) ? (
                <span title="Viene de un pedido">
                    <QIcono nombre="enlace" tamaño="sm" />
                </span>
            ) : (
                ""
            ),
    },
    {
        id: "descripcion",
        cabecera: "Línea",
        prioridad: "alta",
        render: etiquetaLinea,
    },
    { id: "cantidad", cabecera: "Cantidad", tipo: "numero", prioridad: "alta" },
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
        render: (linea: LineaAlbaran) => porcentaje(linea.dtoPorcentual),
    },
    {
        id: "dtoLineal",
        cabecera: "Dto. lineal",
        tipo: "moneda",
        divisa,
        prioridad: "baja",
    },
    { id: "grupoIvaProductoId", cabecera: "IVA", prioridad: "media" },
    {
        id: "tipoIrpf",
        cabecera: "% I.R.P.F.",
        prioridad: "baja",
        render: (linea: LineaAlbaran) => porcentaje(linea.tipoIrpf),
    },
    {
        id: "pvpTotal",
        cabecera: "Total",
        tipo: "moneda",
        divisa,
        prioridad: "alta",
    },
];
