import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.js";
import { useEffect } from "react";
import { ConciliarMovimientoBancario } from "../conciliar/ConciliarMovimientoBancario.js";
import { DesconciliarMovimientoBancario } from "../desconciliar/DesconciliarMovimientoBancario.js";
import { MovimientoBancario } from "../diseño.js";
import { IgnorarMovimientoBancario } from "../ignorar/IgnorarMovimientoBancario.js";
import { ReactivarMovimientoBancario } from "../reactivar/ReactivarMovimientoBancario.js";
import { contextoDetalleConciliacionInicial, metaMovimientoBancario } from "./detalle.js";
import "./DetalleConciliacion.css";
import { getMaquina } from "./maquina.js";
import { TabConciliacion } from "./TabConciliacion.js";
import { TabGeneral } from "./TabGeneral.js";

/**
 * Detalle de un movimiento bancario. La cabecera (tab "General") es de solo
 * lectura (la gestiona el proveedor bancario); las acciones de conciliación manual (fase 3:
 * Conciliar/Desconciliar/Ignorar/Reactivar) viven en el tab "Conciliación"
 * (ver TabConciliacion.tsx) y sus modales asociados, montados aquí según
 * `estado`.
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

    const { estado, movimiento, candidatos, candidatosTexto, candidatoSeleccionado } = ctx;

    useEffect(() => {
        emitir("movimiento_id_cambiado", id, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (!ctx.movimiento.id) return null;

    const titulo = (m: MovimientoBancario) => m.concepto || `Movimiento ${m.id}`;

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
                    <Tab label="General"
                        key="tab-general"
                        children={<TabGeneral form={formModelo} movimiento={ctx.movimiento} />}
                    />,
                    <Tab label="Conciliación"
                        key="tab-conciliacion"
                        children={
                            <TabConciliacion
                                form={formModelo}
                                movimiento={movimiento}
                                candidatos={candidatos}
                                candidatosTexto={candidatosTexto}
                                publicar={emitir}
                            />
                        }
                    />,
                ]} />
            </div>

            {estado === "CONCILIANDO" && candidatoSeleccionado && (
                <ConciliarMovimientoBancario
                    movimiento={movimiento}
                    candidato={candidatoSeleccionado}
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
