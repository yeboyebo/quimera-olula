import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QEtiqueta } from "@olula/componentes/atomos/qetiqueta.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { Listado } from "@olula/componentes/maestro/Listado.js";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.tsx";
import {
    filtroFechas,
    MetaCampoFiltro,
    MetaFiltro,
} from "@olula/componentes/maestro/maestroFiltros/MaestroFiltrosActivoControlado.js";
import { ClausulaFiltro, Criteria } from "@olula/lib/diseño.ts";
import { criteriaDefecto, formatearFechaDate, formatearMoneda } from "@olula/lib/dominio.js";
import { listaActivaEntidadesInicial } from "@olula/lib/ListaActivaEntidades.js";
import { getUrlParams, useUrlParams } from "@olula/lib/url-params.js";
import { useEffect, useMemo, useRef } from "react";
import { useLocation, useParams } from "react-router";
import { CuentaBancariaSelect } from "#/empresa/comun/componentes/cuenta_bancaria_select.tsx";
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
import { PanelCuadreBancario } from "./PanelCuadreBancario.js";

const metaFiltroCuenta: MetaCampoFiltro = {
    id: "cuenta_banco_id",
    label: "Cuenta bancaria",
    filtro: (v) => (v ? ["cuenta_banco_id", "=", v as string] : null),
    render: (valor, onChange) => (
        <CuentaBancariaSelect
            valor={valor as string | undefined}
            label="Cuenta bancaria"
            onChange={(op) => onChange(op?.valor ?? null)}
        />
    ),
};

const metaFiltroBase: MetaFiltro = {
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
 * Se monta en `/tesoreria/conciliacion` (todas las cuentas) y en
 * `/tesoreria/cuentas/<cuenta_id>/movimientos` (solo esa cuenta bancaria de la
 * empresa; es el enlace que llega en el aviso tras la lectura diaria).
 *
 * "Sincronizar" no abre un modal propio: dispara el estado SINCRONIZANDO, que
 * monta <SincronizarMovimientoBancario> — un componente sin UI propia que llama
 * a /movimiento_bancario/sincronizar y publica el resumen al terminar (ver ese
 * fichero). El resumen se muestra en un modal aparte y recarga la lista.
 */
export const MaestroConDetalleConciliacion = () => {

    const criteriaBase = useMemo(criteriaMovimientosPendientes, []);
    const { cuenta_id: cuentaBancoId = null } = useParams();

    // Cuando la cuenta viene fijada por URL no se ofrece el selector en el filtro.
    const metaFiltro: MetaFiltro = useMemo(
        () => cuentaBancoId
            ? metaFiltroBase
            : { cuenta_banco_id: metaFiltroCuenta, ...metaFiltroBase },
        [cuentaBancoId],
    );

    /**
     * Detecta si el usuario llega desde un badge del panel de cuadre bancario.
     * Si hay `_label` en la URL, los filtros son del cuadre (no del usuario):
     *   - `filtrosCuadreInicial` se guarda en el contexto de la máquina y se aplica
     *     siempre a la consulta, independientemente de los filtros manuales.
     *   - `criteriaInicial` del Listado empieza limpio (solo criteriaBase).
     * Si no hay `_label`, comportamiento previo: filtros de URL o criteriaBase.
     */
    const { id, filtrosCuadreInicial, criteriaInicial, etiquetaCuadreInicial } = useMemo(() => {
        const params = new URLSearchParams(window.location.search);
        const label = params.get("_label");
        const { id: urlId, criteria } = getUrlParams();

        if (label) {
            return {
                id: urlId,
                filtrosCuadreInicial: criteria.filtro as ClausulaFiltro[],
                criteriaInicial: { ...criteriaBase, filtro: [] as ClausulaFiltro[] },
                etiquetaCuadreInicial: label,
            };
        }
        return {
            id: urlId,
            filtrosCuadreInicial: [] as ClausulaFiltro[],
            criteriaInicial: criteria.filtro.length > 0 ? criteria : criteriaBase,
            etiquetaCuadreInicial: null as string | null,
        };
    }, [criteriaBase]);

    const { ctx, emitir } = useMaquina(getMaquina, {
        estado: "INICIAL",
        movimientos: listaActivaEntidadesInicial<MovimientoBancario>(id, criteriaInicial),
        cuentaBancoId,
        resumenSincronizacion: null,
        resumenConciliacionAutomatica: null,
        versionCuadre: 0,
        filtrosCuadre: filtrosCuadreInicial,
        etiquetaCuadre: etiquetaCuadreInicial,
    });

    const { estado, movimientos, resumenSincronizacion, resumenConciliacionAutomatica, versionCuadre, etiquetaCuadre } = ctx;

    useUrlParams(movimientos.activo, movimientos.criteria);

    const location = useLocation();
    /**
     * Se usa para saltar el primer disparo del efecto (el montaje ya está
     * inicializado desde useMemo, no hace falta volver a emitir).
     */
    const esPrimerRenderRef = useRef(true);

    /**
     * Detecta navegaciones de badge dentro de la misma ruta montada
     * (e.g. el usuario ya está en /cuentas/X/movimientos y clica otro badge).
     *
     * Por qué location.key y no location.search:
     *   useUrlParams llama a window.history.replaceState directamente, sin pasar
     *   por React Router. React Router no detecta esos cambios, así que
     *   location.search queda como la URL del badge original aunque la barra de
     *   direcciones del navegador ya muestre otra cosa. Si dependiéramos de
     *   location.search nunca veríamos el cambio cuando el usuario vuelve a clicar
     *   el mismo badge (React Router cree que ya está en esa URL).
     *
     *   location.key sí cambia en cada pushState de <Link> (React Router lo gestiona
     *   internamente aunque la URL "parezca" la misma), y NO cambia con replaceState
     *   de useUrlParams. Es el dep correcto.
     *
     *   Leemos window.location.search (URL real del navegador) para obtener _label,
     *   no location.search (URL interna stale de React Router).
     */
    useEffect(() => {
        if (esPrimerRenderRef.current) {
            esPrimerRenderRef.current = false;
            return;
        }

        const params = new URLSearchParams(window.location.search);
        const label = params.get("_label");
        if (!label) return;

        const { criteria } = getUrlParams();
        emitir("filtro_cuadre_establecido", {
            filtrosCuadre: criteria.filtro as ClausulaFiltro[],
            etiquetaCuadre: label,
            criteriaBase,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.key]);

    useEffect(() => {
        emitir("recarga_de_movimientos_solicitada", movimientos.criteria);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="Conciliacion">
            <MaestroDetalle<MovimientoBancario>
                Maestro={
                    <>
                        <h2>{tituloConciliacion(cuentaBancoId, movimientos.lista)}</h2>
                        <PanelCuadreBancario version={versionCuadre} />
                        {etiquetaCuadre && (
                            <div className="FiltroCuadreActivo">
                                <span>Mostrando: <strong>{etiquetaCuadre}</strong></span>
                                <QBoton
                                    variante="borde"
                                    onClick={() => emitir("filtro_cuadre_limpiado", criteriaBase)}
                                >
                                    Ver todos
                                </QBoton>
                            </div>
                        )}
                        <Listado<MovimientoBancario>
                            metaTabla={metaTablaMovimientoBancario}
                            metaFiltro={etiquetaCuadre ? {} : metaFiltro}
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

const tituloConciliacion = (cuentaBancoId: string | null, movimientos: MovimientoBancario[]): string => {
    if (!cuentaBancoId) return "Conciliación bancaria";

    const descripcion = movimientos.find((m) => m.descripcionCuentaBanco)?.descripcionCuentaBanco;
    return `Movimientos de la cuenta ${descripcion ?? cuentaBancoId}`;
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
