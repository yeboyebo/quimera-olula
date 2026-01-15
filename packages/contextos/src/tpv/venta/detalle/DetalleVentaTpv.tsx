import { TotalesVenta } from "#/ventas/venta/vistas/TotalesVenta.tsx";
import { Detalle, QBoton, Tab, Tabs } from "@olula/componentes/index.js";
import { ContextoError } from "@olula/lib/contexto.js";
import { EmitirEvento, Entidad } from "@olula/lib/diseño.js";
import { procesarEvento } from "@olula/lib/dominio.js";
import { useModelo } from "@olula/lib/useModelo.js";
import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { BorrarVentaTpv } from "../borrar/BorrarVentaTpv.tsx";
import { BorrarPagoVentaTpv } from "../borrar_pago/BorrarPagoVentaTpv.tsx";
import { DevolverVentaTpv } from "../devolver/DevolverVentaTpv.tsx";
import { ContextoVentaTpv, EstadoVentaTpv, LineaFactura, PagoVentaTpv, VentaTpv } from "../diseño.ts";
import { ventaTpvVacia } from "../dominio.ts";
import { PagarTarjetaVentaTpv } from "../pagar_con_tarjeta/PagarTarjetaVentaTpv.tsx";
import { PagoValeVentaTpv } from "../pagar_con_vale/PagoValeVentaTpv.tsx";
import { PagarEfectivoVentaTpv } from "../pagar_en_efectivo/PagarEfectivoVentaTpv.tsx";
import { PendienteVenta } from "./comps/PendienteVenta.tsx";
import { metaVentaTpv } from "./detalle.ts";
import { Lineas } from "./lineas/Lineas.tsx";
import { getMaquina } from "./maquina.ts";
import { Pagos } from "./pagos/Pagos.tsx";
import { TabCliente } from "./tabs/TabCliente.tsx";
import { TabDatos } from "./tabs/TabDatos.tsx";


const maquina = getMaquina();  

export const DetalleVentaTpv = ({
    ventaInicial = null,
    publicar = () => {},
}: {
    ventaInicial?: VentaTpv | null;
    publicar?: EmitirEvento;
}) => {
    const params = useParams();
    const { intentar } = useContext(ContextoError);

    const [estado, setEstado] = useState<EstadoVentaTpv>("ABIERTA");
    const [lineaActiva, setLineaActiva] = useState<LineaFactura | null>(null);
    const [pagoActivo, setPagoActivo] = useState<PagoVentaTpv | null>(null);

    const ventaId = ventaInicial?.id ?? params.id;
    const titulo = (venta: Entidad) => venta.codigo as string;

    const venta = useModelo(metaVentaTpv, ventaTpvVacia);
    const { modelo, init } = venta;

    const emitir = useCallback(
        async (evento: string, payload?: unknown, inicial: boolean = false) => {

            const contexto: ContextoVentaTpv = {
                estado: inicial ? 'INICIAL' : estado,
                venta: venta.modelo,
                ventaInicial: venta.modeloInicial,
                pagoActivo,
                lineaActiva,
            }
            const [nuevoContexto, eventos] = await intentar(
                () => procesarEvento(maquina, contexto, evento, payload)
            );
            setEstado(nuevoContexto.estado);
            setPagoActivo(nuevoContexto.pagoActivo); 
            setLineaActiva(nuevoContexto.lineaActiva);
            if (nuevoContexto.venta !== venta.modelo) {
                init(nuevoContexto.venta);
            }
            eventos.map((evento) => publicar(evento[0], evento[1]));
        },
        [venta, pagoActivo, setPagoActivo, lineaActiva, setLineaActiva, estado, setEstado, init, intentar, publicar]
    );

    const guardar = async () => {
        emitir("edicion_de_venta_lista", modelo);
    };

    const cancelar = () => {
        emitir("edicion_de_venta_cancelada");
    };

    useEffect(() => {
        if (ventaId && ventaId !== venta.modelo.id) {
            emitir("venta_id_cambiada", ventaId, true);
        }
    }, [ventaId, emitir, venta.modelo.id]);

  
    return (
        <Detalle
            id={ventaId}
            obtenerTitulo={titulo}
            setEntidad={() => {}}
            entidad={modelo}
            cerrarDetalle={()=> emitir("venta_deseleccionada", null, true)}
        >
        {!!ventaId && (
            <div className="DetalleFactura">
                { estado !== "EMITIDA" && (
                    <div className="botones maestro-botones ">
                    <QBoton onClick={() => emitir("borrar_solicitado")}>
                        Borrar
                    </QBoton> 
                    </div>
                )}
                <Tabs
                    children={[
                    <Tab
                        key="tab-1"
                        label="Cliente"
                        children={
                        <TabCliente venta={venta} publicar={emitir} />
                        }
                    />,
                    <Tab
                        key="tab-2"
                        label="Datos"
                        children={<TabDatos venta={venta} />}
                    />,
                    <Tab
                        key="tab-3"
                        label="Pagos"
                        children={
                            <Pagos pagoActivo={pagoActivo}
                                pagos={venta.modelo.pagos}
                                estado={estado}
                                publicar={emitir}
                            />
                        }
                    />,
                    ]}
                ></Tabs>
                {venta.modificado && (
                    <div className="botones maestro-botones ">
                    <QBoton onClick={guardar} deshabilitado={!venta.valido}>
                        Guardar
                    </QBoton>
                    <QBoton tipo="reset" variante="texto" onClick={cancelar}>
                        Cancelar
                    </QBoton>
                    </div>
                )}

                <TotalesVenta
                    neto={Number(modelo.neto ?? 0)}
                    totalIva={Number(modelo.total_iva ?? 0)}
                    total={Number(modelo.total ?? 0)}
                    divisa={String(modelo.coddivisa ?? "EUR")}
                />

                { estado !== "EMITIDA" && (
                    <PendienteVenta 
                        publicar={emitir}
                        venta={venta}
                    />
                )}
                
                <Lineas
                    venta={venta.modelo}
                    lineaActiva={lineaActiva}
                    publicar={emitir}
                    estadoVenta={estado}
                />
                {
                    estado === "BORRANDO_VENTA" &&
                    <BorrarVentaTpv
                        publicar={emitir}
                        venta = {modelo}
                    />
                }
                {
                    estado === "PAGANDO_EN_EFECTIVO" &&
                    <PagarEfectivoVentaTpv
                        publicar={emitir}
                        venta={modelo}
                    />
                }
                {
                    estado === "PAGANDO_CON_TARJETA" &&
                    <PagarTarjetaVentaTpv
                        publicar={emitir}
                        venta={modelo}
                    />
                }
                {
                    estado === "PAGANDO_CON_VALE" &&
                    <PagoValeVentaTpv
                        publicar={emitir}
                        venta={modelo}
                    />
                }
                {
                    estado === "BORRANDO_PAGO" && pagoActivo &&
                    <BorrarPagoVentaTpv
                        venta={modelo}
                        publicar={emitir}
                        idPago={pagoActivo.id}
                    />
                }
                {
                    estado === "DEVOLVIENDO_VENTA" &&
                    <DevolverVentaTpv 
                        publicar={emitir}
                        venta={modelo}
                    />
                }
            </div>
        )}
        </Detalle>
    );
};
