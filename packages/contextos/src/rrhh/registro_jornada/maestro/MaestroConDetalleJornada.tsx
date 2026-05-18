import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { Listado } from "@olula/componentes/maestro/Listado.js";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.tsx";
import { listaActivaEntidadesInicial } from "@olula/lib/ListaActivaEntidades.js";
import { getUrlParams, useUrlParams } from "@olula/lib/url-params.js";
import { useEffect } from "react";
import { CrearJornada } from "../crear/CrearJornada.tsx";
import { RegistroJornada } from "../diseño.ts";
import { DetalleJornada } from "../detalle/DetalleJornada.tsx";
import { ContextoMaestroJornadas, metaTablaJornada } from "./diseño.ts";
import { getMaquina } from "./maquina.ts";

export const MaestroConDetalleJornada = () => {
    const { id, criteria } = getUrlParams();

    const contextoInicial: ContextoMaestroJornadas = {
        estado: "INICIAL",
        jornadas: listaActivaEntidadesInicial<RegistroJornada>(id, criteria),
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
                        <h2>Registro de jornadas</h2>
                        <Listado<RegistroJornada>
                            metaTabla={metaTablaJornada}
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
