import { TotalesVenta } from "#/ventas/venta/vistas/TotalesVenta.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { Detalle, QBoton, Tab, Tabs } from "@olula/componentes/index.js";
import { ContextoError } from "@olula/lib/contexto.js";
import { EmitirEvento, Entidad } from "@olula/lib/diseño.js";
import { listaEntidadesInicial } from "@olula/lib/ListaEntidades.js";
import { useModelo } from "@olula/lib/useModelo.js";
import { useCallback, useContext, useEffect } from "react";
import { useParams } from "react-router";
import { BorrarVentaTpv } from "../borrar/BorrarVentaTpv.tsx";
import { BorrarPagoVentaTpv } from "../borrar_pago/BorrarPagoVentaTpv.tsx";
import { DevolverVentaTpv } from "../devolver/DevolverVentaTpv.tsx";
import { LineaFactura, PagoVentaTpv, VentaTpv } from "../diseño.ts";
import { ventaTpvVacia } from "../dominio.ts";
import { PagarTarjetaVentaTpv } from "../pagar_con_tarjeta/PagarTarjetaVentaTpv.tsx";
import { PagoValeVentaTpv } from "../pagar_con_vale/PagoValeVentaTpv.tsx";
import { PagarEfectivoVentaTpv } from "../pagar_en_efectivo/PagarEfectivoVentaTpv.tsx";
import { PendienteVenta } from "./comps/PendienteVenta.tsx";
import { ContextoVentaTpv, guardarVenta, metaVentaTpv } from "./detalle.ts";
import { Lineas } from "./lineas/Lineas.tsx";
import { getMaquina } from "./maquina.ts";
import { Pagos } from "./pagos/Pagos.tsx";
import { TabCliente } from "./tabs/TabCliente.tsx";

export const DetalleVentaTpv = ({
    ventaInicial = null,
    publicar = async () => {},
}: {
    ventaInicial?: VentaTpv | null;
    publicar?: EmitirEvento;
}) => {
    const params = useParams();

    const {intentar} = useContext(ContextoError);

    const contextoInicial:ContextoVentaTpv = {
        estado: 'INICIAL',
        venta: ventaInicial ?? ventaTpvVacia,
        ventaInicial: ventaInicial ?? ventaTpvVacia,
        pagos: listaEntidadesInicial<PagoVentaTpv>(),
        lineas: listaEntidadesInicial<LineaFactura>(),
    }

    const ventaId = ventaInicial?.id ?? params.id;
    const titulo = (venta: Entidad) => venta.codigo as string;

    const { ctx, emitir } = useMaquina(
        getMaquina,
        contextoInicial,
        publicar
    ) 

    const autoGuardar = useCallback(async (venta: VentaTpv) => {
        await intentar(async () => {
            await guardarVenta(ctx, venta);
            await emitir("venta_guardada");
        });
    }, [intentar, ctx, emitir]);

    const modeloVenta = useModelo(metaVentaTpv, ctx.venta, autoGuardar);
  
    useEffect(() => {
        if (ventaId && ventaId !== ctx?.venta.id) {
            emitir("venta_id_cambiada", ventaId, true);
        }
    }, [ventaId, emitir, ctx]);

    // export const getFormVenta = (
    //     contexto: ContextoVentaTpv,
    //     setCtx: (ctx: ContextoVentaTpv) => void,
    //     emitir: EmitirEvento,
    //     intentar: Intentar
    // ): FormModelo => {
    
    //     const { venta, ventaInicial } = contexto
    //     const meta = metaVentaTpv;
    
    //     function onModeloCambiado(venta: VentaTpv) {
    //         setCtx({ ...contexto, venta });
    //     }
    
    //     async function autoGuardado(venta: VentaTpv) {
    //         await intentar(async () => {
    //             await guardarVenta(contexto, venta);
    //             await emitir("venta_guardada");
    //         });
    //     }
    
    //     return getFormProps(venta, ventaInicial, meta, onModeloCambiado, autoGuardado);
    // }

    
    // console.log('modeloVenta', modeloVenta.modeloInicial);
    // console.log('ctx.venta', ctx.venta);
    
    // const formVenta = getFormVenta(ctx, setCtx, emitir, intentar);
          
    const { estado, pagos, lineas, venta } = ctx;
  
    return (
        <Detalle
            id={ventaId}
            obtenerTitulo={titulo}
            setEntidad={() => {}}
            entidad={venta}
            cerrarDetalle={()=> emitir("venta_deseleccionada", null, true)}
        >
        {!!ventaId && (
            <div className="DetalleFactura">
                { estado !== "EMITIDA" && (
                    <div className="botones maestro-botones ">
                        <QBoton texto='Borrar venta'
                            onClick={() => emitir("borrar_solicitado")}
                        />
                    </div>
                )}
                <Tabs
                    children={[
                    <Tab
                        key="tab-1"
                        label="Cliente"
                        children={
                            <TabCliente
                                venta={venta}
                                estado={estado}
                                form={modeloVenta}
                                publicar={emitir}
                            />
                        }
                    />,
                    <Tab
                        key="tab-3"
                        label="Pagos"
                        children={
                            <Pagos pagoActivo={pagos.activo}
                                pagos={pagos.lista}
                                estado={estado}
                                publicar={emitir}
                            />
                        }
                    />,
                    ]}
                ></Tabs>

                <TotalesVenta
                    neto={Number(venta.neto ?? 0)}
                    totalIva={Number(venta.total_iva ?? 0)}
                    total={Number(venta.total ?? 0)}
                    divisa={String(venta.coddivisa ?? "EUR")}
                />

                { estado !== "EMITIDA" && (
                    <PendienteVenta 
                        publicar={emitir}
                        venta={venta}
                    />
                )}
                
                <Lineas
                    lineas={lineas}
                    venta={venta}
                    publicar={emitir}
                    estadoVenta={estado}
                />
                {
                    estado === "BORRANDO_VENTA" &&
                    <BorrarVentaTpv
                        publicar={emitir}
                        venta={venta}
                    />
                }
                {
                    estado === "PAGANDO_EN_EFECTIVO" &&
                    <PagarEfectivoVentaTpv
                        publicar={emitir}
                        venta={venta}
                    />
                }
                {
                    estado === "PAGANDO_CON_TARJETA" &&
                    <PagarTarjetaVentaTpv
                        publicar={emitir}
                        venta={venta}
                    />
                }
                {
                    estado === "PAGANDO_CON_VALE" &&
                    <PagoValeVentaTpv
                        publicar={emitir}
                        venta={venta}
                    />
                }
                {
                    estado === "BORRANDO_PAGO" && pagos.activo &&
                    <BorrarPagoVentaTpv
                        publicar={emitir}
                        venta={venta}
                        idPago={pagos.activo.id}
                    />
                }
                {
                    estado === "DEVOLVIENDO_VENTA" &&
                    <DevolverVentaTpv 
                        venta={venta}
                        publicar={emitir}
                    />
                }
            </div>
        )}
        </Detalle>
    );
};
