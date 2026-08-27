import { ListadoSemiControlado } from "@olula/componentes/maestro/ListadoSemiControlado.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { criteriaDefecto } from "@olula/lib/dominio.ts";
import { LineaFactura } from "../../diseño.ts";
import { metaTablaLineaFactura } from "./metatabla_linea_factura.tsx";

export const LineasLista = ({
    lineas,
    divisa,
    seleccionada,
    publicar,
}: {
    lineas: LineaFactura[];
    divisa?: string;
    seleccionada?: string;
    publicar: EmitirEvento;
}) => (
    <ListadoSemiControlado
        metaTabla={metaTablaLineaFactura(divisa)}
        entidades={lineas}
        totalEntidades={lineas.length}
        cargando={false}
        seleccionada={lineas.find((linea) => linea.id === seleccionada) ?? null}
        onSeleccion={(linea: LineaFactura) => publicar("linea_seleccionada", linea)}
        criteriaInicial={criteriaDefecto}
        onCriteriaChanged={() => null}
        modo="tabla"
    />
);
