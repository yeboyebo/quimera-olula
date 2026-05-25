import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { Listado } from "@olula/componentes/maestro/Listado.js";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.tsx";
import { getMetaFiltroDefecto, MetaFiltro } from "@olula/componentes/maestro/maestroFiltros/MaestroFiltrosActivoControlado.js";
import { listaActivaEntidadesInicial } from "@olula/lib/ListaActivaEntidades.js";
import { getUrlParams, useUrlParams } from "@olula/lib/url-params.js";
import { useEffect, useState } from "react";
import { CrearJornada } from "../crear/CrearJornada.tsx";
import { DetalleJornada } from "../detalle/DetalleJornada.tsx";
import { RegistroJornada } from "../diseño.ts";
import { minutosAHorasMinutos } from "../dominio.ts";
import { ContextoMaestroJornadas, metaTablaJornada } from "./diseño.ts";
import { getMaquina } from "./maquina.ts";

export const MaestroConDetalleJornada = () => {

    const { id, criteria } = getUrlParams();
    const [seleccionadas, setSeleccionadas] = useState([] as string[]);

    const contextoInicial: ContextoMaestroJornadas = {
        estado: "INICIAL",
        jornadas: listaActivaEntidadesInicial<RegistroJornada>(id, criteria),
        mediaMinutos: 0,
    };

    const { ctx, emitir } = useMaquina(getMaquina, contextoInicial);

    useUrlParams(ctx.jornadas.activo, ctx.jornadas.criteria);

    useEffect(() => {
        emitir("recarga_de_jornadas_solicitada", ctx.jornadas.criteria);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { estado } = ctx;

    return (
        <div className="RegistroJornada">
            <MaestroDetalle<RegistroJornada>
                Maestro={
                    <>
                        <h2>Registro de jornadas — Media: {minutosAHorasMinutos(ctx.mediaMinutos)}</h2>
                        <Listado<RegistroJornada>
                            metaTabla={metaTablaJornada}
                            metaFiltro = {metaFiltro}
                            modoMultiseleccion={true}
                            onMultiSeleccion={setSeleccionadas}
                            criteria={ctx.jornadas.criteria}
                            modo="tabla"
                            entidades={ctx.jornadas.lista}
                            totalEntidades={ctx.jornadas.total}
                            seleccionada={ctx.jornadas.activo}
                            renderAcciones={() => (
                                <div className="maestro-botones">
                                    <QBoton onClick={() => emitir("creacion_de_jornada_solicitada")}>
                                        Nueva jornada
                                    </QBoton>
                                    <QBoton onClick={() => console.log('Aprobar', seleccionadas)}>
                                        Aprobar
                                    </QBoton>
                                </div>
                            )}
                            onSeleccion={(payload) => emitir("jornada_seleccionada", payload)}
                            onCriteriaChanged={(payload) => emitir("criteria_cambiado", payload)}
                        />
                    </>
                }
                Detalle={<DetalleJornada id={ctx.jornadas.activo} publicar={emitir} />}
                seleccionada={ctx.jornadas.activo}
                modoDisposicion="maestro-50"
            />

            {estado === "CREANDO_JORNADA" && (
                <CrearJornada publicar={emitir} />
            )}
        </div>
    );
};

const metaFiltro: MetaFiltro = {
    ...getMetaFiltroDefecto(metaTablaJornada),
    empleadoId: {
        id: "empleadoId",
        label: "Empleado",
        filtro: (v) => (v ? ["empleado_id", "=", v as string] : null),
        // render: (valor, onChange) => (
        // <TipoAccion
        //     valor={(valor as string) ?? ""}
        //     onChange={(opcion) => onChange(opcion?.valor ?? "")}
        // />
        // ),
    },
}