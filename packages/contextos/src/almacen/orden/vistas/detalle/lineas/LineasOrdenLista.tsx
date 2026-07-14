import { MetaTabla } from "@olula/componentes/atomos/qtablacontrolada.tsx";
import { ListadoSemiControlado } from "@olula/componentes/maestro/ListadoSemiControlado.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { LecturaLineaOrden, LineaOrdenAlmacen } from "../../../diseño.ts";

const formatearFechaHoraLectura = (fechaHora: Date | string): string => {
    const d = fechaHora instanceof Date ? fechaHora : new Date(fechaHora);
    return isNaN(d.getTime()) ? String(fechaHora) : d.toLocaleString();
};

const ExpansionLecturas = ({ entidad }: { entidad: LineaOrdenAlmacen }) => {
    const lecturas: LecturaLineaOrden[] = entidad.lecturas ?? [];
    if (!lecturas.length) return <p>Sin lecturas</p>;
    return (
        <table>
            <thead>
                <tr>
                    <th>Lote</th>
                    <th>Cantidad</th>
                    <th>Fecha/Hora</th>
                    <th>Ubi.Origen</th>
                    <th>Ubi.Destino</th>
                </tr>
            </thead>
            <tbody>
                {lecturas.map((l) => (
                    <tr key={l.id}>
                        <td>{l.loteId}</td>
                        <td>{l.cantidad}</td>
                        <td>{formatearFechaHoraLectura(l.fechaHora)}</td>
                        <td>{l.ubicacionOrigenId}</td>
                        <td>{l.ubicacionDestinoId}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

const metaTablaLineasOrden: MetaTabla<LineaOrdenAlmacen> = {
    cols: [
        { id: "sku", cabecera: "SKU" },
        { id: "articulo", cabecera: "Descripción" },
        { id: "cantidadPrevista", cabecera: "Cantidad prevista" },
        { id: "cantidadReal", cabecera: "Cantidad real" },
        { id: "ubicacionOrigenId", cabecera: "Ubi.Origen" },
        { id: "ubicacionDestinoId", cabecera: "Ubi.Destino" },
    ],
    expansion: ExpansionLecturas,
};

export const LineasOrdenLista = ({
    lineas,
    seleccionada,
    publicar,
}: {
    lineas: LineaOrdenAlmacen[];
    seleccionada?: string;
    publicar: EmitirEvento;
}) => {
    const setSeleccionada = (linea: LineaOrdenAlmacen) => {
        publicar("linea_seleccionada", linea);
    };

    return (
        <ListadoSemiControlado
            metaTabla={metaTablaLineasOrden}
            entidades={lineas}
            totalEntidades={lineas.length}
            cargando={false}
            seleccionada={lineas.find((l) => l.id === seleccionada) ?? null}
            onSeleccion={setSeleccionada}
            criteriaInicial={criteriaDefecto}
            onCriteriaChanged={() => null}
            modo="tabla"
        />
    );
};
