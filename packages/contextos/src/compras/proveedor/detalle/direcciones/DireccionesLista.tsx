import { MetaTabla } from "@olula/componentes/atomos/qtabla.tsx";
import { ListadoSemiControlado } from "@olula/componentes/maestro/ListadoSemiControlado.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { criteriaDefecto } from "@olula/lib/dominio.ts";
import { DireccionProveedor } from "../../diseño.ts";

const metaTablaDirecciones: MetaTabla<DireccionProveedor> = [
    {
        id: "principal",
        cabecera: "Principal",
        render: (d: DireccionProveedor) => (d.principal ? "Sí" : ""),
    },
    { id: "tipoVia", cabecera: "Tipo Vía" },
    { id: "nombreVia", cabecera: "Nombre Vía" },
    { id: "numero", cabecera: "Número" },
    { id: "codPostal", cabecera: "C.P." },
    { id: "ciudad", cabecera: "Ciudad" },
    { id: "provincia", cabecera: "Provincia" },
    { id: "telefono", cabecera: "Teléfono" },
];

export const DireccionesLista = ({
    direcciones,
    seleccionada,
    publicar,
}: {
    direcciones: DireccionProveedor[];
    seleccionada?: string;
    publicar: EmitirEvento;
}) => {
    return (
        <ListadoSemiControlado
            metaTabla={metaTablaDirecciones}
            entidades={direcciones}
            totalEntidades={direcciones.length}
            cargando={false}
            seleccionada={direcciones.find((d) => d.id === seleccionada) ?? null}
            onSeleccion={(direccion: DireccionProveedor) =>
                publicar("direccion_seleccionada", direccion)
            }
            criteriaInicial={criteriaDefecto}
            onCriteriaChanged={() => null}
            modo="tabla"
        />
    );
};
