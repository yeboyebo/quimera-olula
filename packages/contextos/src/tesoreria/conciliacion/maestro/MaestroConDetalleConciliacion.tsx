import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QEtiqueta } from "@olula/componentes/atomos/qetiqueta.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { Listado } from "@olula/componentes/maestro/Listado.js";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.tsx";
import {
    filtroFechas,
    MetaFiltro,
} from "@olula/componentes/maestro/maestroFiltros/MaestroFiltrosActivoControlado.js";
import { ClausulaFiltro, Criteria } from "@olula/lib/diseño.ts";
import { criteriaDefecto, formatearFechaDate, formatearMoneda } from "@olula/lib/dominio.js";
import { listaActivaEntidadesInicial } from "@olula/lib/ListaActivaEntidades.js";
import { getUrlParams, useUrlParams } from "@olula/lib/url-params.js";
import { useEffect, useMemo } from "react";
import { DetalleConciliacion } from "../detalle/DetalleConciliacion.js";
import { MovimientoBancario } from "../diseño.js";
import {
    ESTADOS_MOVIMIENTO_BANCARIO_DEFECTO,
    esIngresoMovimientoBancario,
    estadosMovimientoBancarioDesdeFiltro,
    etiquetaEstadoMovimientoBancario,
    filtroEstadoMovimientoBancario,
    opcionesEstadoMovimientoBancario,
    varianteEstadoMovimientoBancario,
} from "../dominio.js";
import "./MaestroConDetalleConciliacion.css";
import { getMaquina } from "./maquina.js";
import { metaTablaMovimientoBancario } from "./metatabla_conciliacion.js";
import { ResumenSincronizacionMovimientoBancario } from "./ResumenSincronizacionMovimientoBancario.js";
import { ConciliarAutomaticamenteMovimientos } from "./ConciliarAutomaticamenteMovimientos.js";
import { ResumenConciliacionAutomatica } from "./ResumenConciliacionAutomatica.js";
import { SincronizarMovimientoBancario } from "./SincronizarMovimientoBancario.js";

const metaFiltroMovimientoBancario: MetaFiltro = {
    estado: {
        id: "estado",
        label: "Estado",
        tipo: "multiseleccion",
        opciones: opcionesEstadoMovimientoBancario,
        filtro: filtroEstadoMovimientoBancario,
        fromFiltro: estadosMovimientoBancarioDesdeFiltro,
    },
    fecha: {
        id: "fecha",
        label: "Fecha",
        tipo: "intervalo_fechas",
        filtro: (v) => filtroFechas("fecha", v),
    },
    concepto: {
        id: "concepto",
        label: "Concepto",
        filtro: (v) => (v ? ["concepto", "~", v as string] : null),
    },
    contraparte: {
        id: "contraparte",
        label: "Contraparte",
        filtro: (v) => (v ? ["contraparte", "~", v as string] : null),
    },
};

/** Por defecto: no conciliados/ignorados, ordenados por fecha descendente. */
const criteriaMovimientosPendientes = (): Criteria => ({
    ...criteriaDefecto,
    filtro: [
        ["estado", "in", ESTADOS_MOVIMIENTO_BANCARIO_DEFECTO as unknown as string],
    ] as ClausulaFiltro[],
    orden: ["fecha", "DESC"],
    paginacion: { ...criteriaDefecto.paginacion },
});

/**
 * Componente principal: listado de movimientos bancarios (conciliación) + detalle.
 *
 * "Sincronizar" no abre un modal propio: dispara el estado SINCRONIZANDO, que
 * monta <SincronizarMovimientoBancario> — un componente sin UI propia que llama
 * a /movimiento_bancario/sincronizar y publica el resumen al terminar (ver ese
 * fichero). El resumen se muestra en un modal aparte y recarga la lista.
 */
export const MaestroConDetalleConciliacion = () => {

    const criteriaBase = useMemo(criteriaMovimientosPendientes, []);

    const { id, criteria } = getUrlParams();
    const criteriaInicial = criteria.filtro.length > 0 ? criteria : criteriaBase;

    const { ctx, emitir } = useMaquina(getMaquina, {
        estado: "INICIAL",
        movimientos: listaActivaEntidadesInicial<MovimientoBancario>(id, criteriaInicial),
        resumenSincronizacion: null,
        resumenConciliacionAutomatica: null,
    });

    const { estado, movimientos, resumenSincronizacion, resumenConciliacionAutomatica } = ctx;

    useUrlParams(movimientos.activo, movimientos.criteria);

    useEffect(() => {
        emitir("recarga_de_movimientos_solicitada", movimientos.criteria);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="Conciliacion">
            <MaestroDetalle<MovimientoBancario>
                Maestro={
                    <>
                        <h2>Conciliación bancaria</h2>
                        <Listado<MovimientoBancario>
                            metaTabla={metaTablaMovimientoBancario}
                            metaFiltro={metaFiltroMovimientoBancario}
                            criteria={movimientos.criteria}
                            modoInicial="tabla"
                            tarjeta={TarjetaMovimientoBancario}
                            entidades={movimientos.lista}
                            totalEntidades={movimientos.total}
                            seleccionada={movimientos.activo}
                            renderAcciones={() => (
                                <div className="maestro-botones">
                                    <QBoton
                                        variante="borde"
                                        onClick={() => emitir("conciliacion_automatica_solicitada")}
                                        deshabilitado={estado !== "INICIAL"}
                                    >
                                        {estado === "CONCILIANDO_AUTOMATICAMENTE"
                                            ? "Conciliando…"
                                            : "Conciliar automáticamente"}
                                    </QBoton>
                                    <QBoton
                                        onClick={() => emitir("sincronizacion_solicitada")}
                                        deshabilitado={estado !== "INICIAL"}
                                    >
                                        {estado === "SINCRONIZANDO" ? "Sincronizando…" : "Sincronizar"}
                                    </QBoton>
                                </div>
                            )}
                            onSeleccion={(payload) => emitir("movimiento_seleccionado", payload)}
                            onCriteriaChanged={(payload) => emitir("criteria_cambiado", payload)}
                            onSiguientePagina={(payload) => emitir("siguiente_pagina", payload)}
                        />
                    </>
                }
                Detalle={<DetalleConciliacion id={movimientos.activo} publicar={emitir} />}
                seleccionada={movimientos.activo}
                modoDisposicion="maestro-50"
            />

            {estado === "SINCRONIZANDO" && (
                <SincronizarMovimientoBancario publicar={emitir} />
            )}

            {estado === "CONCILIANDO_AUTOMATICAMENTE" && (
                <ConciliarAutomaticamenteMovimientos publicar={emitir} />
            )}

            {resumenSincronizacion && (
                <ResumenSincronizacionMovimientoBancario
                    resumen={resumenSincronizacion}
                    publicar={emitir}
                />
            )}

            {resumenConciliacionAutomatica && (
                <ResumenConciliacionAutomatica
                    resumen={resumenConciliacionAutomatica}
                    publicar={emitir}
                />
            )}
        </div>
    );
};

/**
 * Componente tarjeta para la vista en modo tarjetas (pantallas estrechas).
 * Se define fuera del componente principal para evitar re-renders.
 */
const TarjetaMovimientoBancario = (movimiento: MovimientoBancario) => (
    <div className="tarjeta-movimiento-bancario" key={movimiento.id}>
        <div className="tarjeta-movimiento-bancario-fecha">{formatearFechaDate(movimiento.fecha)}</div>
        <div className="tarjeta-movimiento-bancario-concepto">{movimiento.concepto}</div>
        <span className={esIngresoMovimientoBancario(movimiento) ? "importe-ingreso" : "importe-cargo"}>
            {formatearMoneda(movimiento.importe, movimiento.divisa ?? "EUR")}
        </span>
        <QEtiqueta variante={varianteEstadoMovimientoBancario(movimiento.estado)}>
            {etiquetaEstadoMovimientoBancario(movimiento.estado)}
        </QEtiqueta>
    </div>
);
