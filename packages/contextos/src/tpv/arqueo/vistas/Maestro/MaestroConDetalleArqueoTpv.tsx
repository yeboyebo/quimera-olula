import { agenteActivo, puntoVentaLocal } from "#/tpv/comun/infraestructura.ts";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { ListadoControlado } from "@olula/componentes/maestro/ListadoControlado.js";
import { MaestroDetalleControlado } from "@olula/componentes/maestro/MaestroDetalleControlado.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { Criteria } from "@olula/lib/diseño.js";
import { criteriaDefecto, procesarEvento } from "@olula/lib/dominio.js";
import { useCallback, useContext, useEffect, useState } from "react";
import { ArqueoTpv } from "../../diseño.ts";
import { DetalleArqueoTpv } from "../Detalle/ArqueoTpv.tsx";
import "./MaestroConDetalleArqueoTpv.css";
import { ContextoMaestroArqueosTpv, metaTablaArqueo } from "./diseño.ts";
import { getMaquina } from "./maquina.ts";

puntoVentaLocal.actualizar('000001');
agenteActivo.actualizar('000001');
const miPuntoArqueoLocal = puntoVentaLocal.obtener() ;
const miAgenteActivo = agenteActivo.obtener() ;

const maquina = getMaquina();

const criteriaBaseArqueos = {
    ...criteriaDefecto,
    // filtro: {
    //     ...criteriaDefecto.filtro,
    //     punto_arqueo_id: 'x'
    // },
    // orden: ["codigo", "DESC"]
}

export const MaestroConDetalleArqueoTpv = () => {

    const { intentar } = useContext(ContextoError);

    const [cargando, setCargando] = useState(false);

    const [ctx, setCtx] = useState<ContextoMaestroArqueosTpv>({
        estado: "INICIAL",
        arqueos: [],
        totalArqueos: 0,
        arqueoActivo: null,
    })

    const emitir = useCallback(
        async (evento: string, payload?: unknown) => {

            const [nuevoContexto, _] = await intentar(
                () => procesarEvento(maquina, ctx, evento, payload, )
            );
            setCtx(nuevoContexto);
        },
        [ctx, setCtx, intentar]
    );
    
    const crear = useCallback(
        () => emitir("creacion_de_arqueo_solicitada"),
        [emitir]
    );

    const setSeleccionada = useCallback(
        (payload: ArqueoTpv) => emitir("arqueo_seleccionado", payload),
        [emitir]
    );

    const recargar = useCallback(
        async (criteria: Criteria) => {
            setCargando(true);
            await emitir("recarga_de_arqueos_solicitada", criteria);
            setCargando(false);
        },
        [emitir, setCargando]
    );

    useEffect(() => {
        recargar(criteriaBaseArqueos);
    }, [])

    return ( 
        <div className="Arqueo"> 
            <MaestroDetalleControlado<ArqueoTpv>
                Maestro={
                    <>
                        <h2>Arqueos TPV</h2>
                        <h2>Punto de arqueo {miPuntoArqueoLocal} </h2>
                        <h2>Agente {miAgenteActivo} </h2>
                        <div className="maestro-botones">
                            <QBoton onClick={crear}>Abrir arqueo</QBoton>
                        </div>
                        <ListadoControlado
                            metaTabla={metaTablaArqueo}
                            metaFiltro={true}
                            cargando={cargando}
                            criteriaInicial={criteriaDefecto}
                            modo={'tabla'}
                            // setModo={handleSetModoVisualizacion}
                            // tarjeta={tarjeta}
                            entidades={ctx.arqueos}
                            totalEntidades={ctx.totalArqueos}
                            seleccionada={ctx.arqueoActivo}
                            onSeleccion={setSeleccionada}
                            onCriteriaChanged={recargar}
                        />
                    </>
                }
                Detalle={
                    <DetalleArqueoTpv arqueoInicial={ctx.arqueoActivo} publicar={emitir} />
                }
                seleccionada={ctx.arqueoActivo}
                modoDisposicion="maestro-50"
            />
        </div>
    );
};
