import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.js";
import { useEffect } from "react";
import { ConciliarMovimientoBancario } from "../conciliar/ConciliarMovimientoBancario.js";
import { ConciliarAsientoMovimientoBancario } from "../conciliar_asiento/ConciliarAsientoMovimientoBancario.js";
import { DesconciliarMovimientoBancario } from "../desconciliar/DesconciliarMovimientoBancario.js";
import { MovimientoBancario } from "../diseño.js";
import { IgnorarMovimientoBancario } from "../ignorar/IgnorarMovimientoBancario.js";
import { ReactivarMovimientoBancario } from "../reactivar/ReactivarMovimientoBancario.js";
import { contextoDetalleConciliacionInicial, metaMovimientoBancario } from "./detalle.js";
import "./DetalleConciliacion.css";
import { getMaquina } from "./maquina.js";
import { SeccionEstadoConciliacion } from "./SeccionEstadoConciliacion.js";
import { TabConciliacion } from "./TabConciliacion.js";
import { TabGeneral } from "./TabGeneral.js";
import { TabPartidas } from "./TabPartidas.js";

/**
 * Detalle de un movimiento bancario.
 *
 * Layout:
 * - Tab "Conciliación":
 *   - Siempre visible: SeccionEstadoConciliacion (etiqueta de estado + info
 *     del elemento ERP conciliado + botones Desconciliar/Reactivar).
 *   - Solo cuando el movimiento puede conciliarse (pendiente/candidatos):
 *     sub-pestañas "Recibos" (búsqueda de candidatos) y "Partidas" (asientos
 *     contables sin movimiento equivalente).
 * - Tab "General": cabecera de solo lectura del movimiento.
 *
 * Los modales (Conciliar/Desconciliar/Ignorar/Reactivar) se montan aquí
 * fuera del panel según `estado` de la máquina.
 */
export const DetalleConciliacion = ({
    id,
    publicar = async () => {},
}: {
    id?: string;
    publicar?: EmitirEvento;
}) => {

    const { ctx, emitir } = useMaquina(
        getMaquina,
        contextoDetalleConciliacionInicial,
        publicar
    );

    const formModelo = useModelo(metaMovimientoBancario, ctx.movimiento);

    const { estado, movimiento, conciliaciones, conciliacionAplicada, candidatos, candidatosTexto, conciliacionSeleccionada } = ctx;

    useEffect(() => {
        emitir("movimiento_id_cambiado", id, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (!ctx.movimiento.id) return null;

    const titulo = (m: MovimientoBancario) => m.concepto || `Movimiento ${m.id}`;

    const puedeVincularPartida =
        movimiento.estado === "pendiente" || movimiento.estado === "candidatos";

    return (
        <Detalle
            id={id}
            obtenerTitulo={titulo}
            setEntidad={() => {}}
            entidad={ctx.movimiento}
            cerrarDetalle={() => emitir("movimiento_deseleccionado", null, true)}
        >
            <div className="DetalleConciliacion">
                <Tabs children={[
                    <Tab label="Conciliación"
                        key="tab-conciliacion"
                        children={
                            <div className="DetalleConciliacion-conciliacion">
                                <SeccionEstadoConciliacion
                                    form={formModelo}
                                    movimiento={movimiento}
                                    conciliacionAplicada={conciliacionAplicada}
                                    publicar={emitir}
                                />
                                {puedeVincularPartida && (
                                    <Tabs children={[
                                        <Tab label="Recibos"
                                            key="tab-recibos"
                                            children={
                                                <TabConciliacion
                                                    movimiento={movimiento}
                                                    conciliaciones={conciliaciones}
                                                    candidatos={candidatos}
                                                    candidatosTexto={candidatosTexto}
                                                    publicar={emitir}
                                                />
                                            }
                                        />,
                                        <Tab label="Partidas"
                                            key="tab-partidas"
                                            children={
                                                <TabPartidas movimiento={movimiento} publicar={emitir} />
                                            }
                                        />,
                                    ]} />
                                )}
                            </div>
                        }
                    />,
                    <Tab label="General"
                        key="tab-general"
                        children={<TabGeneral form={formModelo} movimiento={ctx.movimiento} />}
                    />,
                ]} />
            </div>

            {estado === "CONCILIANDO" && conciliacionSeleccionada && (
                conciliacionSeleccionada.items[0]?.tipo === "asiento_manual"
                    ? <ConciliarAsientoMovimientoBancario movimiento={movimiento} publicar={emitir} />
                    : <ConciliarMovimientoBancario
                        movimiento={movimiento}
                        conciliacion={conciliacionSeleccionada}
                        publicar={emitir}
                    />
            )}
            {estado === "DESCONCILIANDO" && (
                <DesconciliarMovimientoBancario movimiento={movimiento} publicar={emitir} />
            )}
            {estado === "IGNORANDO" && (
                <IgnorarMovimientoBancario movimiento={movimiento} publicar={emitir} />
            )}
            {estado === "REACTIVANDO" && (
                <ReactivarMovimientoBancario movimiento={movimiento} publicar={emitir} />
            )}
        </Detalle>
    );
};
