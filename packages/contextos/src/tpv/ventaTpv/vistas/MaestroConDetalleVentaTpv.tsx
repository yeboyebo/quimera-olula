import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { ListadoControlado } from "@olula/componentes/maestro/ListadoControlado.js";
import { MaestroDetalleControlado } from "@olula/componentes/maestro/MaestroDetalleControlado.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { Criteria } from "@olula/lib/diseño.js";
import { criteriaDefecto, procesarEvento, publicar } from "@olula/lib/dominio.js";
import { useCallback, useContext, useEffect, useState } from "react";
import { ContextoMaestroVentasTpv, VentaTpv } from "../diseño.ts";
import { metaTablaFactura } from "../dominio.ts";
import { agenteActivo, puntoVentaLocal } from "../infraestructura.ts";
import { getMaquina } from "../maquinaMaestro.ts";
import { DetalleVentaTpv } from "./DetalleVentaTpv/DetalleVentaTpv.tsx";
import "./MaestroConDetalleVentaTpv.css";
puntoVentaLocal.actualizar('000001');
agenteActivo.actualizar('000001');
let miPuntoVentaLocal = puntoVentaLocal.obtener() ;
let miAgenteActivo = agenteActivo.obtener() ;

const maquina = getMaquina();  

export const MaestroConDetalleVentaTpv = () => {

    const { intentar } = useContext(ContextoError);

    const [ctx, setCtx] = useState<ContextoMaestroVentasTpv>({
        estado: "INICIAL",
        ventas: [],
        totalVentas: 0,
        ventaActiva: null,
    })

    const emitir = useCallback(
        async (evento: string, payload?: unknown) => {

            const [nuevoContexto, eventos] = await intentar(
                () => procesarEvento(maquina, ctx, evento, payload, )
            );
            setCtx(nuevoContexto);
            eventos.map((evento) => publicar(evento[0], evento[1]));
        },
        [ctx, setCtx, intentar, publicar]
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
            emitir("recarga_de_ventas_solicitada", criteria);
        },
        [emitir]
    );

    useEffect(() => {
        emitir("recarga_de_ventas_solicitada", criteriaDefecto);   
    }, [])

    // const [modoListado, setModoListado] = useState('tabla')

    return ( 
        <div className="Factura"> 
            <MaestroDetalleControlado<VentaTpv>
                Maestro={
                    <>
                        <h2>Ventas TPV</h2>
                        <h2>Punto de venta {miPuntoVentaLocal} </h2>
                        <h2>Agente {miAgenteActivo} </h2>
                        <div className="maestro-botones">
                            <QBoton onClick={crear}>Nueva Venta</QBoton>
                        </div>
                        <ListadoControlado
                            metaTabla={metaTablaFactura}
                            criteria={criteriaDefecto}
                            modo={'tabla'}
                            // setModo={handleSetModoVisualizacion}
                            // tarjeta={tarjeta}
                            entidades={ctx.ventas}
                            totalEntidades={ctx.totalVentas}
                            seleccionada={ctx.ventaActiva}
                            setSeleccionada={setSeleccionada}
                            recargar={recargar}
                        />
                    </>
                }
                Detalle={
                    <DetalleVentaTpv ventaInicial={ctx.ventaActiva} publicar={emitir} />
                }
                seleccionada={ctx.ventaActiva}
                modoDisposicion="maestro-50"
            />
        </div>
    );
};
