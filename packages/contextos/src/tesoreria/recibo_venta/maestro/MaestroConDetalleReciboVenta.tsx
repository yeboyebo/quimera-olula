import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { MetaTabla } from "@olula/componentes/index.js";
import { Listado } from "@olula/componentes/maestro/Listado.js";
import { filtroFechas, MetaFiltro } from "@olula/componentes/maestro/maestroFiltros/MaestroFiltrosActivoControlado.js";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.tsx";
import { ClausulaFiltro, Criteria } from "@olula/lib/diseño.ts";
import { criteriaDefecto, formatearMoneda } from "@olula/lib/dominio.js";
import { listaActivaEntidadesInicial } from "@olula/lib/ListaActivaEntidades.js";
import { getUrlParams, useUrlParams } from "@olula/lib/url-params.js";
import { useEffect, useMemo } from "react";
import { DetalleReciboVenta } from "../detalle/DetalleReciboVenta.js";
import { ReciboVenta } from "../diseño.js";
import {
    ESTADOS_RECIBO_VENTA_DEFECTO,
    estadosDesdeFiltro,
    filtroEstadoReciboVenta,
    opcionesEstadoReciboVenta,
} from "../dominio.js";
import { AgruparRecibosVenta } from "./AgruparRecibosVenta.js";
import { recibosAAgrupar } from "./maestro.js";
import "./MaestroConDetalleReciboVenta.css";
import { getMaquina } from "./maquina.js";

const metaTablaReciboVenta: MetaTabla<ReciboVenta> = [
    { id: 'codigo', cabecera: 'Código' },
    { id: 'nombreCliente', cabecera: 'Cliente' },
    { id: 'idFiscal', cabecera: 'ID Fiscal' },
    { id: 'fechaEmision', cabecera: 'F. Emisión', tipo: 'fecha' },
    { id: 'fechaVencimiento', cabecera: 'F. Vencimiento', tipo: 'fecha' },
    { id: 'estado', cabecera: 'Estado' },
    { id: 'importe', cabecera: 'Importe', tipo: 'moneda' },
];

const metaFiltroReciboVenta: MetaFiltro = {
    codigo: {
        id: "codigo",
        label: "Código",
        filtro: (v) => (v ? ["codigo", "~", v as string] : null),
    },
    nombre_cliente: {
        id: "nombre_cliente",
        label: "Cliente",
        filtro: (v) => (v ? ["nombre_cliente", "~", v as string] : null),
    },
    id_fiscal: {
        id: "id_fiscal",
        label: "ID Fiscal",
        filtro: (v) => (v ? ["id_fiscal", "~", v as string] : null),
    },
    fecha_vencimiento: {
        id: "fecha_vencimiento",
        label: "F. Vencimiento",
        tipo: "intervalo_fechas",
        filtro: (v) => filtroFechas("fecha_vencimiento", v),
    },
    estado: {
        id: "estado",
        label: "Estado",
        tipo: "multiseleccion",
        opciones: opcionesEstadoReciboVenta,
        filtro: filtroEstadoReciboVenta,
        fromFiltro: estadosDesdeFiltro,
    },
};

const criteriaRecibosVivos = (): Criteria => ({
    ...criteriaDefecto,
    filtro: [
        ["estado", "in", ESTADOS_RECIBO_VENTA_DEFECTO as unknown as string],
    ] as ClausulaFiltro[],
    paginacion: { ...criteriaDefecto.paginacion },
});

export const MaestroConDetalleReciboVenta = () => {

    const criteriaBase = useMemo(criteriaRecibosVivos, []);

    const { id, criteria } = getUrlParams();
    const criteriaInicial = criteria.filtro.length > 0 ? criteria : criteriaBase;

    const { ctx, emitir } = useMaquina(getMaquina, {
        estado: "INICIAL",
        recibos: listaActivaEntidadesInicial<ReciboVenta>(id, criteriaInicial),
        seleccionados: [],
    });

    const { estado, recibos, seleccionados } = ctx;

    const aAgrupar = recibosAAgrupar(seleccionados, recibos.lista);

    useUrlParams(recibos.activo, recibos.criteria);

    useEffect(() => {
        emitir("recarga_de_recibos_solicitada", recibos.criteria);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="ReciboVenta">
            <MaestroDetalle<ReciboVenta>
                Maestro={
                    <>
                        <h2>Recibos de venta</h2>
                        <Listado<ReciboVenta>
                            metaTabla={metaTablaReciboVenta}
                            metaFiltro={metaFiltroReciboVenta}
                            criteria={recibos.criteria}
                            modoInicial="tabla"
                            tarjeta={TarjetaReciboVenta}
                            entidades={recibos.lista}
                            totalEntidades={recibos.total}
                            seleccionada={recibos.activo}
                            seleccionadas={seleccionados}
                            onMultiSeleccion={(ids) => emitir("seleccionados_cambiados", ids)}
                            renderAcciones={() => (
                                <div className="maestro-botones">
                                    {aAgrupar.length > 0 && (
                                        <QBoton onClick={() => emitir("agrupado_solicitado")}>
                                            {`Agrupar (${aAgrupar.length})`}
                                        </QBoton>
                                    )}
                                </div>
                            )}
                            onSeleccion={(payload) => emitir("recibo_seleccionado", payload)}
                            onCriteriaChanged={(payload) => emitir("criteria_cambiado", payload)}
                            onSiguientePagina={(payload) => emitir("siguiente_pagina", payload)}
                        />
                    </>
                }
                Detalle={<DetalleReciboVenta id={recibos.activo} publicar={emitir} />}
                seleccionada={recibos.activo}
                modoDisposicion="maestro-50"
            />

            {estado === "AGRUPANDO" && (
                <AgruparRecibosVenta recibos={aAgrupar} publicar={emitir} />
            )}
        </div>
    );
};

const TarjetaReciboVenta = (recibo: ReciboVenta) => {
    return (
        <div className="tarjeta-recibo-venta" key={recibo.id}>
            <div className="tarjeta-recibo-venta-codigo">{recibo.codigo}</div>
            <div className="tarjeta-recibo-venta-importe">
                {formatearMoneda(recibo.importe, "EUR")}
            </div>
            <div className={`tarjeta-recibo-venta-estado estado-${recibo.estado}`}>
                {recibo.estado}
            </div>
        </div>
    );
};
