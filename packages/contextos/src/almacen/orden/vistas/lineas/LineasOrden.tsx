import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { MetaTabla } from "@olula/componentes/atomos/qtabla.tsx";
import { ListadoSemiControlado } from "@olula/componentes/maestro/ListadoSemiControlado.tsx";
import { getMetaFiltroDefecto } from "@olula/componentes/maestro/maestroFiltros/MaestroFiltrosActivoControlado.tsx";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { Criteria, RespuestaLista2 } from "@olula/lib/diseño.ts";
import { criteriaDefecto } from "@olula/lib/dominio.ts";
import { getSeleccionada } from "@olula/lib/entidad.ts";
import { useCallback, useContext, useEffect, useState } from "react";
import { LineaOrdenAlmacenConId } from "../../diseño.ts";
import { getOrden } from "../../infraestructura.ts";
import { useMaquinaLineasOrden } from "../../maquina_lineas_orden.ts";
import { BorrarLineaOrden } from "./BorrarLineaOrden.tsx";
import { CrearLineaOrden } from "./CrearLineaOrden.tsx";
import { EditarLineaOrden } from "./EditarLineaOrden.tsx";

const metaTablaLineasOrden: MetaTabla<LineaOrdenAlmacenConId> = [
    { id: "sku", cabecera: "SKU" },
    { id: "cantidadPrevista", cabecera: "Cantidad prevista" },
    { id: "cantidadReal", cabecera: "Cantidad real" },
];

const metaFiltroLineas = getMetaFiltroDefecto(metaTablaLineasOrden);

export const LineasOrden = ({
    ordenId,
}: {
    ordenId: string;
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
        RespuestaLista2<LineaOrdenAlmacenConId>
    >({ datos: [], total: 0 });

    const setEntidades = useCallback(
        (payload: LineaOrdenAlmacenConId[]) => emitir("lineas_cargadas", payload),
        [emitir]
    );
    const setSeleccionada = useCallback(
        (payload: LineaOrdenAlmacenConId) => emitir("linea_seleccionada", payload),
        [emitir]
    );

    const seleccionada = getSeleccionada(lineas);

    const cargarLineas = useCallback(
        async (_criteria: Criteria = criteriaDefecto) => {
            if (ordenId) {
                const orden = await intentar(() => getOrden(ordenId));
                const lineasConId = (orden.lineas as LineaOrdenAlmacenConId[]).filter(
                    (l): l is LineaOrdenAlmacenConId => !!l.id
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
                    onClick={() => emitir("borrado_solicitado")}
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
            {seleccionada && (
                <QModal
                    nombre="editarLineaOrden"
                    abierto={estado === "Edicion"}
                    onCerrar={() => emitir("edicion_cancelada")}
                >
                    <EditarLineaOrden
                        emitir={emitir}
                        lineaInicial={seleccionada}
                        ordenId={ordenId}
                    />
                </QModal>
            )}
            <CrearLineaOrden
                publicar={emitir}
                activo={estado === "Alta"}
                ordenId={ordenId}
            />
            <BorrarLineaOrden
                publicar={emitir}
                activo={estado === "ConfirmarBorrado"}
                linea={seleccionada}
                ordenId={ordenId}
            />
        </>
    );
};
