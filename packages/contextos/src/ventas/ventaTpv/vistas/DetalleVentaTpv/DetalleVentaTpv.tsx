import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento, Entidad, ListaSeleccionable } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { TotalesVenta } from "../../../venta/vistas/TotalesVenta.tsx";
import { ContextoVentaTpv, EstadoVentaTpv, LineaFactura, PagoVentaTpv, VentaTpv } from "../../diseño.ts";
import { metaVentaTpv, procesarEvento, ventaTpvVacia } from "../../dominio.ts";
import {
    patchFactura
} from "../../infraestructura.ts";
import { BajaVentaTpv } from "./BajaVentaTpv.tsx";
import "./DetalleVentaTpv.css";
import { DevolucionVenta } from "./Devolucion/DevolucionVenta.tsx";
import { Lineas } from "./Lineas/Lineas.tsx";
import { AltaPagoEfectivo } from "./Pagos/AltaPagoEfectivo.tsx";
import { AltaPagoTarjeta } from "./Pagos/AltaPagoTarjeta.tsx";
import { BajaPago } from "./Pagos/BajaPago.tsx";
import { EmisionVale } from "./Pagos/EmisionVale.tsx";
import { Pagos } from "./Pagos/Pagos.tsx";
import { PendienteVenta } from "./PendienteVenta.tsx";
import { TabCliente } from "./TabCliente/TabCliente.tsx";
import { TabDatos } from "./TabDatos.tsx";

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
    const { modelo, init, modeloInicial } = venta;


    console.log('FUERA', venta.modelo, venta.modeloInicial);

    const emitir = useCallback(
        async (evento: string, payload?: unknown, inicial: boolean = false) => {
            console.log('venta.modeloInicial INICIO:', venta.modelo, venta.modeloInicial);
            const contexto: ContextoVentaTpv = {
                estado: inicial ? 'INICIAL' : estado,
                venta: venta.modelo,
                ventaInicial: venta.modeloInicial,
                lineas: lineas,
                pagos: pagos,
                eventos: [],
            }
            console.log("Evento recibido:", evento, "con payload:", payload); //procesarEvento
            const nuevoContexto = await intentar(
                () => procesarEvento(evento, payload, contexto)
            );
            setEstado(nuevoContexto.estado);
            setLineas(nuevoContexto.lineas);
            setPagos(nuevoContexto.pagos);
            if (nuevoContexto.venta !== venta.modelo) {
                console.log("Venta Iniciada:", nuevoContexto.venta);
                init(nuevoContexto.venta);
                console.log("Modelo inicial:", venta.modeloInicial);
            } else {
                console.log("Venta sin cambios:", venta.modelo);
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
                        children={<Pagos pagos={pagos} venta={venta} estado={estado} publicar={emitir} />}
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
                <AltaPagoEfectivo
                    publicar={emitir}
                    activo={estado === "PAGANDO_EFECTIVO"}
                    idVenta={ventaId}
                    pendiente={modelo.total - modelo.pagado}
                />
                <AltaPagoTarjeta
                    publicar={emitir}
                    activo={estado === "PAGANDO_TARJETA"}
                    idVenta={ventaId}
                    pendiente={modelo.total - modelo.pagado}
                />
                <BajaPago
                    publicar={emitir}
                    activo={estado === "BORRANDO_PAGO"}
                    idPago={pagos.idActivo || undefined}
                    idVenta={venta.modelo.id}
                />
                <DevolucionVenta 
                    publicar={emitir}
                    activo={estado === "DEVOLVIENDO_VENTA"}
                    idVenta={venta.modelo.id}
                />

                <EmisionVale
                    publicar={emitir}
                    activo={estado === "EMITIENDO_VALE"}
                    venta={venta}
                />
            </div>
        )}
        </Detalle>
    );
};
