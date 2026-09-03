import { ListadoSemiControlado } from "@olula/componentes/maestro/ListadoSemiControlado.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { criteriaDefecto } from "@olula/lib/dominio.ts";
import { LineaAlbaran } from "../../diseño.ts";
import { metaTablaLineaAlbaran } from "./metatabla_linea_albaran.tsx";

export const LineasLista = ({
    lineas,
    divisa,
    seleccionada,
    publicar,
}: {
    lineas: LineaAlbaran[];
    divisa?: string;
    seleccionada?: string;
    publicar: EmitirEvento;
}) => (
    <ListadoSemiControlado
        metaTabla={metaTablaLineaAlbaran(divisa)}
        entidades={lineas}
        totalEntidades={lineas.length}
        cargando={false}
        seleccionada={lineas.find((linea) => linea.id === seleccionada) ?? null}
        onSeleccion={(linea: LineaAlbaran) => publicar("linea_seleccionada", linea)}
        criteriaInicial={criteriaDefecto}
        onCriteriaChanged={() => null}
        modo="tabla"
    />
);
