import { AgenteTpvActual } from "#/tpv/agente/agente_actual/AgenteTpvActual.tsx";
import { PuntoVentaTpvActual } from "#/tpv/punto_de_venta/punto_actual/PuntoVentaTpvActual.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { ListadoControlado } from "@olula/componentes/maestro/ListadoControlado.js";
import { MaestroDetalleControlado } from "@olula/componentes/maestro/MaestroDetalleControlado.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { Criteria } from "@olula/lib/diseño.js";
import { criteriaDefecto, procesarEvento } from "@olula/lib/dominio.js";
import { useCallback, useContext, useEffect, useState } from "react";
import { DetalleVentaTpv } from "../detalle/DetalleVentaTpv.tsx";
import { ContextoMaestroVentasTpv, VentaTpv } from "../diseño.ts";
import { metaTablaFactura } from "./maestro.ts";
import "./MaestroConDetalleVentaTpv.css";
import { getMaquina } from "./maquina.ts";

const maquina = getMaquina();

const criteriaBaseVentas = {
    ...criteriaDefecto,
    filtro: {
        ...criteriaDefecto.filtro,
        punto_venta_id: 'x'
    },
    orden: ["codigo", "DESC"]
    
}
type Layout = "TABLA" | "TARJETA";

export const MaestroConDetalleVentaTpv = () => {

    const { intentar } = useContext(ContextoError);

    const [cargando, setCargando] = useState(false);
    const [layout, setLayout] = useState<Layout>("TARJETA");

    const [ctx, setCtx] = useState<ContextoMaestroVentasTpv>({
        estado: "INICIAL",
        ventas: [],
        totalVentas: 0,
        ventaActiva: null,
    })

    const emitir = useCallback(
        async (evento: string, payload?: unknown) => {

            const [nuevoContexto, _] = await intentar(
                () => procesarEvento(maquina, ctx, evento, payload, )
            );
            setCtx(nuevoContexto);
        },
        [ctx, setCtx, setCargando,intentar]
    );

    const cambiarLayout = useCallback(
        () => setLayout(layout === "TARJETA" ? "TABLA" : "TARJETA"),
        [layout, setLayout]
    );
    
    const crear = useCallback(
        () => emitir("creacion_de_venta_solicitada"),
        [emitir]
    );

    const setSeleccionada = useCallback(
        (payload: VentaTpv) => emitir("venta_seleccionada", payload),
        [emitir]
    );

    const recargar = useCallback(
        async (criteria: Criteria) => {
            await emitir("recarga_de_ventas_solicitada", criteria);
        },
        [emitir]
    );
    
    useEffect(() => {
        setCargando(true);
        recargar(criteriaBaseVentas);
        setCargando(false);
    }, [])

    return ( 
        <div className="Factura"> 
            <MaestroDetalleControlado<VentaTpv>
                Maestro={
                    <>
                        <h2>Ventas TPV</h2>
                        <div className="maestro-botones">
                            <QBoton 
                                texto={layout === "TARJETA" ? "Cambiar a TABLA" : "Cambiar a TARJETA"}
                                onClick={cambiarLayout}
                            />
                        </div>
                        <PuntoVentaTpvActual/>
                        <AgenteTpvActual/>
                        <div className="maestro-botones">
                            <QBoton onClick={crear}>Nueva Venta</QBoton>
                        </div>
                        <ListadoControlado
                            metaTabla={metaTablaFactura}
                            metaFiltro={true}
                            cargando={cargando}
                            criteriaInicial={criteriaDefecto}
                            modo={layout === "TARJETA" ? 'tarjetas' : 'tabla'}
                            // setModo={handleSetModoVisualizacion}
                            tarjeta={TarjetaVentaTpv}
                            entidades={ctx.ventas}
                            totalEntidades={ctx.totalVentas}
                            seleccionada={ctx.ventaActiva}
                            onSeleccion={setSeleccionada}
                            onCriteriaChanged={recargar}
                        />
                    </>
                }
                Detalle={
                    <DetalleVentaTpv ventaInicial={ctx.ventaActiva} publicar={emitir} />
                }
                layout={layout}
                seleccionada={ctx.ventaActiva}
                modoDisposicion="maestro-50"
            />
        </div>
    );
};


const TarjetaVentaTpv = (
    venta: VentaTpv ,
) => {

    return (
        <div className="tarjeta-venta">
            {venta.codigo}
        </div>
    )
}