import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { EmitirEvento, Entidad } from "@olula/lib/diseño.js";
import { formatearFechaDate, formatearHoraDate } from "@olula/lib/dominio.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useEffect } from "react";
import { AnularJornada } from "../anular/AnularJornada.tsx";
import { AprobarJornada } from "../aprobar/AprobarJornada.tsx";
import { patchJornada, patchPausarJornada, patchReactivarJornada } from "../infraestructura.ts";
import { PausarJornada } from "../pausar/PausarJornada.tsx";
import { PausasJornada } from "../pausas/PausasJornada.tsx";
import { ReactivarJornada } from "../reactivar/ReactivarJornada.tsx";
import { ContextoDetalleJornada, jornadaVacia, metaJornada } from "./diseño.ts";
import { BotoneraJornadaBorrador } from "./BotoneraJornadaBorrador.tsx";
import { getMaquina } from "./maquina.ts";

const ESTADOS_PAUSAS = ["BORRADOR", "CREANDO_PAUSA", "EDITANDO_PAUSA", "BORRANDO_PAUSA"];

export const DetalleJornada = ({
    id,
    publicar = async () => {},
}: {
    id?: string;
    publicar?: EmitirEvento;
}) => {
    const contextoInicial: ContextoDetalleJornada = {
        estado: "INICIAL",
        jornada: jornadaVacia,
        pausaActiva: null,
    };

    const { ctx, emitir } = useMaquina(getMaquina, contextoInicial, publicar);

    const autoGuardar = useCallback(
        async (jornada: ContextoDetalleJornada['jornada']) => {
            await patchJornada(ctx.jornada.id, {
                horaEntrada: jornada.horaEntrada,
                horaSalida: jornada.horaSalida,
                observaciones: jornada.observaciones,
                pausas: ctx.jornada.pausas,
            });
            await emitir("jornada_guardada");
        },
        [ctx, emitir]
    );

    const horaActual = () => formatearHoraDate(new Date());

    const onPausa = useCallback(async () => {
        await patchPausarJornada(ctx.jornada.id, { horaInicio: horaActual(), causa: "" });
        await emitir("jornada_guardada");
    }, [ctx.jornada.id, emitir]);

    const onStop = useCallback(async () => {
        await patchJornada(ctx.jornada.id, {
            horaEntrada: ctx.jornada.horaEntrada,
            horaSalida: horaActual(),
            observaciones: ctx.jornada.observaciones,
            pausas: ctx.jornada.pausas,
        });
        await emitir("jornada_guardada");
    }, [ctx, emitir]);

    const onPlay = useCallback(async () => {
        await patchReactivarJornada(ctx.jornada.id, { horaFin: horaActual() });
        await emitir("jornada_guardada");
    }, [ctx.jornada.id, emitir]);

    const { uiProps } = useModelo(metaJornada, ctx.jornada, autoGuardar);

    useEffect(() => {
        emitir("id_jornada_cambiado", id, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (!ctx.jornada.id) return null;

    const { estado, jornada } = ctx;

    const titulo = (j: Entidad) =>
        `Jornada ${formatearFechaDate(j.fecha as Date)} — ${j.estado as string}`;

    return (
        <Detalle
            id={id}
            obtenerTitulo={titulo}
            setEntidad={() => {}}
            entidad={jornada}
            cerrarDetalle={() => emitir("jornada_deseleccionada", null, true)}
        >
            <div className="DetalleJornada">
                {estado === "BORRADOR" && (
                    <BotoneraJornadaBorrador
                        estadoBorrador={jornada.estadoBorrador}
                        onPausa={onPausa}
                        onStop={onStop}
                        onPlay={onPlay}
                    />
                )}

                <quimera-formulario>
                    <QInput
                        label="Hora de entrada"
                        {...uiProps("horaEntrada")}
                    />
                    <QInput
                        label="Hora de salida"
                        {...uiProps("horaSalida")}
                    />
                    <QInput
                        label="Observaciones"
                        {...uiProps("observaciones")}
                    />
                </quimera-formulario>

                {estado === "BORRADOR" && (
                    <div className="botones maestro-botones">
                        {jornada.estadoBorrador !== "PAUSADA" && (
                            <QBoton onClick={() => emitir("pausar_solicitado")}>
                                Pausar
                            </QBoton>
                        )}
                        {jornada.estadoBorrador === "PAUSADA" && (
                            <QBoton onClick={() => emitir("reactivar_solicitado")}>
                                Reactivar
                            </QBoton>
                        )}
                        {jornada.estadoBorrador === "CERRADA" && (
                            <QBoton onClick={() => emitir("aprobar_solicitado")}>
                                Aprobar
                            </QBoton>
                        )}
                        <QBoton onClick={() => emitir("anular_solicitado")}>
                            Anular
                        </QBoton>
                    </div>
                )}

                {estado === "APROBADA" && (
                    <div className="botones maestro-botones">
                        <QBoton onClick={() => emitir("anular_solicitado")}>
                            Anular
                        </QBoton>
                    </div>
                )}

                {ESTADOS_PAUSAS.includes(estado) && (
                    <PausasJornada
                        jornada={jornada}
                        estadoBorrador={jornada.estadoBorrador}
                        estadoDetalle={estado}
                        pausaActiva={ctx.pausaActiva}
                        publicar={emitir}
                    />
                )}

                {estado === "APROBANDO" && (
                    <AprobarJornada publicar={emitir} jornada={jornada} />
                )}
                {estado === "ANULANDO" && (
                    <AnularJornada publicar={emitir} jornada={jornada} />
                )}
                {estado === "PAUSANDO" && (
                    <PausarJornada publicar={emitir} jornada={jornada} />
                )}
                {estado === "REACTIVANDO" && (
                    <ReactivarJornada publicar={emitir} jornada={jornada} />
                )}
            </div>
        </Detalle>
    );
};
