import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { MetaTabla, obtenerCols } from "@olula/componentes/atomos/qtablacontrolada.tsx";
import { ListadoSemiControlado } from "@olula/componentes/maestro/ListadoSemiControlado.tsx";
import { getMetaFiltroDefecto } from "@olula/componentes/maestro/maestroFiltros/MaestroFiltrosActivoControlado.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { Criteria, EmitirEvento, RespuestaLista2 } from "@olula/lib/diseño.ts";
import { criteriaDefecto } from "@olula/lib/dominio.ts";
import { getSeleccionada } from "@olula/lib/entidad.ts";
import { useCallback, useContext, useEffect, useState } from "react";
import { LecturaLineaOrden, LineaOrdenAlmacen } from "../../../diseño.ts";
import { getOrden } from "../../../infraestructura.ts";
import { useMaquinaLineasOrden } from "../../../maquina_lineas_orden.ts";
import { CambiarLineaOrden } from "../../cambiar_linea/CambiarLineaOrden.tsx";
import { CrearLineaOrden } from "../../crear_linea/CrearLineaOrden.tsx";

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

const metaFiltroLineas = getMetaFiltroDefecto(obtenerCols(metaTablaLineasOrden));

export const LineasOrden = ({
    ordenId,
    lineas: lineasProp,
    publicar,
}: {
    ordenId: string;
    lineas?: LineaOrdenAlmacen[];
    publicar: EmitirEvento;
}) => {
    const { intentar } = useContext(ContextoError);

    const [
        emitir,
        {
            estado,
            contexto: { lineas },
        },
    ] = useMaquinaLineasOrden();

    const [ordenIdAnterior, setOrdenIdAnterior] = useState<string | null>(null);
    const [lineasRespuesta, setLineasRespuesta] = useState<
        RespuestaLista2<LineaOrdenAlmacen>
    >({ datos: [], total: 0 });

    const setEntidades = useCallback(
        (payload: LineaOrdenAlmacen[]) => emitir("lineas_cargadas", payload),
        [emitir]
    );
    const setSeleccionada = useCallback(
        (payload: LineaOrdenAlmacen) => emitir("linea_seleccionada", payload),
        [emitir]
    );

    const seleccionada = getSeleccionada(lineas);

    const cargarLineas = useCallback(
        async (_criteria: Criteria = criteriaDefecto) => {
            if (ordenId) {
                const orden = await intentar(() => getOrden(ordenId));
                const lineasConId = (orden.lineas as LineaOrdenAlmacen[]).filter(
                    (l): l is LineaOrdenAlmacen => !!l.id
                );
                setEntidades(lineasConId);
                setLineasRespuesta({
                    datos: lineasConId,
                    total: lineasConId.length,
                });
            } else {
                setEntidades([]);
                setLineasRespuesta({ datos: [], total: 0 });
            }
        },
        [ordenId, intentar, setEntidades]
    );

    useEffect(() => {
        const idActual = ordenId || null;
        if (idActual !== ordenIdAnterior) {
            setOrdenIdAnterior(idActual);
            cargarLineas();
        }
    }, [ordenId, cargarLineas, ordenIdAnterior]);

    useEffect(() => {
        if (lineasProp !== undefined) {
            setEntidades(lineasProp);
            setLineasRespuesta({ datos: lineasProp, total: lineasProp.length });
        }
    }, [lineasProp, setEntidades]);

    return (
        <>
            <div className="botones maestro-botones">
                <QBoton onClick={() => emitir("alta_solicitada")}>Nueva línea</QBoton>
                <QBoton
                    deshabilitado={!seleccionada}
                    onClick={() => emitir("edicion_solicitada")}
                >
                    Editar
                </QBoton>
                <QBoton
                    deshabilitado={!seleccionada}
                    onClick={() => seleccionada && publicar("borrado_linea_solicitado", seleccionada)}
                >
                    Borrar
                </QBoton>
            </div>
            {!!ordenId && (
                <ListadoSemiControlado
                    metaTabla={metaTablaLineasOrden}
                    metaFiltro={metaFiltroLineas}
                    cargando={false}
                    criteriaInicial={criteriaDefecto}
                    idReiniciarCriteria={ordenId}
                    modo="tabla"
                    entidades={lineasRespuesta.datos}
                    totalEntidades={lineasRespuesta.total}
                    seleccionada={seleccionada}
                    onSeleccion={setSeleccionada}
                    onCriteriaChanged={cargarLineas}
                />
            )}
            {estado === "Alta" && (
                <CrearLineaOrden publicar={emitir} ordenId={ordenId} />
            )}
            {seleccionada && estado === "Edicion" && (
                <CambiarLineaOrden
                    publicar={emitir}
                    linea={seleccionada}
                    ordenId={ordenId}
                />
            )}
        </>
    );
};
