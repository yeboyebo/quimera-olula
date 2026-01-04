import { TotalesVenta } from "#/ventas/venta/vistas/TotalesVenta.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento, Entidad, ListaSeleccionable } from "@olula/lib/diseño.ts";
import { procesarEvento } from "@olula/lib/dominio.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { ContextoVentaTpv, EstadoVentaTpv, LineaFactura, PagoVentaTpv, VentaTpv } from "../../diseño.ts";
import { metaVentaTpv, ventaTpvVacia } from "../../dominio.ts";
import {
    patchFactura
} from "../../infraestructura.ts";
import { getMaquina } from "../../maquina.ts";
import { BajaVentaTpv } from "./BajaVentaTpv.tsx";
import "./DetalleVentaTpv.css";
import { DevolucionVenta } from "./Devolucion/DevolucionVenta.tsx";
import { Lineas } from "./Lineas/Lineas.tsx";
import { AltaPagoEfectivo } from "./Pagos/AltaPagoEfectivo.tsx";
import { AltaPagoTarjeta } from "./Pagos/AltaPagoTarjeta.tsx";
import { AltaPagoVale } from "./Pagos/AltaPagoVale.tsx";
import { BajaPago } from "./Pagos/BajaPago.tsx";
import { Pagos } from "./Pagos/Pagos.tsx";
import { PendienteVenta } from "./PendienteVenta.tsx";
import { TabCliente } from "./TabCliente/TabCliente.tsx";
import { TabDatos } from "./TabDatos.tsx";

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
    const [pagos, setPagos] = useState<ListaSeleccionable<PagoVentaTpv>>({ lista:[], idActivo: null });
    const [lineas, setLineas] = useState<ListaSeleccionable<LineaFactura>>({ lista:[], idActivo: null });

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
                lineas: lineas,
                pagos: pagos,
                eventos: [],
            }
            const nuevoContexto = await intentar(
                () => procesarEvento(maquina, evento, payload, contexto)
            );
            setEstado(nuevoContexto.estado);
            setLineas(nuevoContexto.lineas);
            setPagos(nuevoContexto.pagos);
            if (nuevoContexto.venta !== venta.modelo) {
                init(nuevoContexto.venta);
            }
            nuevoContexto.eventos.map((evento) => publicar(evento[0], evento[1]));

        },
        [venta, setPagos, setLineas, publicar]
    );

    const guardar = async () => {
        await intentar(() => patchFactura(modelo.id, modelo));
        emitir("venta_cambiada");
    };

    const cancelar = () => {
        emitir("edicion_de_venta_cancelada");
    };


    useEffect(() => {
        if (ventaId && ventaId !== venta.modelo.id) {
            emitir("venta_id_cambiada", ventaId, true);
        }
    }, [ventaId, emitir]);
  
    console.log('Estado:', estado);

    return (
        <Detalle
            id={ventaId}
            obtenerTitulo={titulo}
            // setEntidad={(f) => (init(f))}
            setEntidad={() => {}}
            entidad={modelo}
            // cargar={getVentaUI}   
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
                        <TabCliente factura={venta} publicar={emitir} />
                        }
                    />,
                    <Tab
                        key="tab-2"
                        label="Datos"
                        children={<TabDatos factura={venta} />}
                    />,
                    <Tab
                        key="tab-3"
                        label="Pagos"
                        children={<Pagos pagos={pagos} estado={estado} publicar={emitir} />}
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
                    facturaId={ventaId}
                    lineas={lineas}
                    publicar={emitir}
                    estadoVenta={estado}
                />
                <BajaVentaTpv
                    publicar={emitir}
                    activo={estado === "BORRANDO_VENTA"}
                    idVenta={ventaId}
                />
                {
                    estado === "PAGANDO_EN_EFECTIVO" &&
                    <AltaPagoEfectivo
                        publicar={emitir}
                        venta={modelo}
                    />
                }
                {
                    estado === "PAGANDO_CON_TARJETA" &&
                    <AltaPagoTarjeta
                        publicar={emitir}
                        venta={modelo}
                    />
                }
                {
                    estado === "PAGANDO_CON_VALE" &&
                    <AltaPagoVale
                        publicar={emitir}
                        venta={modelo}
                    />
                }
                {
                    estado === "BORRANDO_PAGO" &&
                    <BajaPago
                        publicar={emitir}
                        idPago={pagos.idActivo || undefined}
                    />
                }
                {
                    estado === "DEVOLVIENDO_VENTA" &&
                    <DevolucionVenta 
                        publicar={emitir}
                        venta={modelo}
                    />
                }

                {/* <EmisionVale
                    publicar={emitir}
                    activo={estado === "EMITIENDO_VALE"}
                    venta={venta}
                /> */}
            </div>
        )}
        </Detalle>
    );
};
