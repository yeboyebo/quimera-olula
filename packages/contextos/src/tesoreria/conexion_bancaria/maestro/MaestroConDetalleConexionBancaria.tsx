import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QIcono } from "@olula/componentes/atomos/qicono.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { MetaTabla } from "@olula/componentes/index.js";
import { Listado } from "@olula/componentes/maestro/Listado.js";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.tsx";
import { criteriaDefecto, formatearFechaHora } from "@olula/lib/dominio.js";
import { listaActivaEntidadesInicial } from "@olula/lib/ListaActivaEntidades.js";
import { getUrlParams, useUrlParams } from "@olula/lib/url-params.js";
import { useEffect, useMemo } from "react";
import { ColumnaEstadoTabla } from "#/comun/componentes/ColumnaEstadoTabla.tsx";
import { ConectarBancoConexionBancaria } from "../conectar_banco/ConectarBancoConexionBancaria.js";
import { DetalleConexionBancaria } from "../detalle/DetalleConexionBancaria.js";
import { ConexionBancaria } from "../diseño.js";
import { nombreInstitucion } from "../dominio.js";
import "./MaestroConDetalleConexionBancaria.css";
import { getMaquina } from "./maquina.js";
import { TarjetasSaldosConexionBancaria } from "./TarjetasSaldosConexionBancaria.js";

const metaTablaConexionBancaria: MetaTabla<ConexionBancaria> = [
    {
        id: 'estado',
        cabecera: '',
        render: (c: ConexionBancaria) => (
            <ColumnaEstadoTabla
                estados={{
                    activa: (
                        <QIcono nombre="circulo_relleno" tamaño="sm" color="var(--color-exito-oscuro)" />
                    ),
                    requiere_reautenticacion: (
                        <QIcono nombre="circulo_relleno" tamaño="sm" color="var(--color-advertencia-oscuro)" />
                    ),
                }}
                estadoActual={c.estado}
            />
        ),
    },
    { id: 'institucionNombre', cabecera: 'Institución', render: (c: ConexionBancaria) => nombreInstitucion(c) },
    {
        id: 'estadoTexto',
        cabecera: 'Estado',
        render: (c: ConexionBancaria) => (
            c.estado === 'requiere_reautenticacion' ? 'Requiere reautenticación' : 'Activa'
        ),
    },
    { id: 'cuentas', cabecera: 'Cuentas', render: (c: ConexionBancaria) => c.cuentas.length },
    {
        id: 'ultimaSincronizacion',
        cabecera: 'Última sincronización',
        render: (c: ConexionBancaria) => (c.ultimaSincronizacion ? formatearFechaHora(c.ultimaSincronizacion) : '-'),
    },
];

/**
 * Componente principal: listado de conexiones bancarias + detalle.
 *
 * "Conectar banco" no abre un modal propio: dispara el estado CONECTANDO, que
 * monta <ConectarBancoConexionBancaria> — un componente sin UI propia que pide
 * los datos de inicio al backend y abre el widget del proveedor bancario
 * activo (ver ese fichero y comun/proveedor_bancario/).
 */
export const MaestroConDetalleConexionBancaria = () => {

    const criteriaBase = useMemo(() => criteriaDefecto, []);

    const { id, criteria } = getUrlParams();
    const criteriaInicial = criteria.filtro.length > 0 ? criteria : criteriaBase;

    const { ctx, emitir } = useMaquina(getMaquina, {
        estado: "INICIAL",
        conexiones: listaActivaEntidadesInicial<ConexionBancaria>(id, criteriaInicial),
    });

    const { estado, conexiones } = ctx;

    useUrlParams(conexiones.activo, conexiones.criteria);

    useEffect(() => {
        emitir("recarga_de_conexiones_bancarias_solicitada", conexiones.criteria);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="ConexionBancaria">
            <MaestroDetalle<ConexionBancaria>
                Maestro={
                    <>
                        <h2>Conexiones bancarias</h2>
                        <TarjetasSaldosConexionBancaria refrescarClave={conexiones.total} />
                        <Listado<ConexionBancaria>
                            metaTabla={metaTablaConexionBancaria}
                            criteria={conexiones.criteria}
                            modoInicial="tabla"
                            tarjeta={TarjetaConexionBancaria}
                            entidades={conexiones.lista}
                            totalEntidades={conexiones.total}
                            seleccionada={conexiones.activo}
                            renderAcciones={() => (
                                <div className="maestro-botones">
                                    <QBoton onClick={() => emitir("conectar_banco_solicitado")}>
                                        Conectar banco
                                    </QBoton>
                                </div>
                            )}
                            onSeleccion={(payload) => emitir("conexion_bancaria_seleccionada", payload)}
                            onCriteriaChanged={(payload) => emitir("criteria_cambiado", payload)}
                            onSiguientePagina={(payload) => emitir("siguiente_pagina", payload)}
                        />
                    </>
                }
                Detalle={<DetalleConexionBancaria id={conexiones.activo} publicar={emitir} />}
                seleccionada={conexiones.activo}
                modoDisposicion="maestro-50"
            />

            {estado === "CONECTANDO" && (
                <ConectarBancoConexionBancaria publicar={emitir} />
            )}
        </div>
    );
};

const TarjetaConexionBancaria = (conexion: ConexionBancaria) => {
    return (
        <div className="tarjeta-conexion-bancaria" key={conexion.id}>
            <div className="tarjeta-conexion-bancaria-institucion">{nombreInstitucion(conexion)}</div>
            <div className={`tarjeta-conexion-bancaria-estado estado-${conexion.estado}`}>
                {conexion.estado === 'requiere_reautenticacion' ? 'Requiere reautenticación' : 'Activa'}
            </div>
            <div className="tarjeta-conexion-bancaria-cuentas">
                {conexion.cuentas.length} cuenta{conexion.cuentas.length === 1 ? '' : 's'}
            </div>
        </div>
    );
};
