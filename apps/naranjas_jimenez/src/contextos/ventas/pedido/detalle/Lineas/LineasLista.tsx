import { LineasListaProps } from "#/ventas/pedido/detalle/Lineas/LineasLista.tsx";
import { LineaPedido } from "#/ventas/pedido/diseño.ts";
import { QTabla } from "@olula/componentes/atomos/qtabla.tsx";

export const LineasListaNrj = ({
    lineas,
    seleccionada,
    onCambioCantidad,
    pedidoEditable,
    publicar,
}: LineasListaProps) => {

    const setSeleccionada = (linea: LineaPedido) => {
        publicar("linea_seleccionada", linea);
    };

    return (
        <>
            <QTabla
                metaTabla={getMetaTablaLineas()}
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

const getMetaTablaLineas = () => {
    return [
        {
            id: "linea",
            cabecera: "Línea",
            render: (linea: LineaPedido) => `${linea.referencia}: ${linea.descripcion}`,
        },
        {
            id: "idVariedad",
            cabecera: "Variedad",
        },
        {
            id: "cantidad",
            cabecera: "Cantidad", 
            tipo: "numero" as const,
        },
        {
            id: "dto_porcentual",
            cabecera: "% Dto.",
            render: (linea: LineaPedido) =>
                linea.dto_porcentual ? `${linea.dto_porcentual}%` : "",
        },
        {
            id: "pvp_total",
            cabecera: "Total",
            tipo: "moneda" as const,
        },
    ];
};
