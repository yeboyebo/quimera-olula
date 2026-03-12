import { TotalesVenta } from "#/ventas/venta/vistas/TotalesVenta.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { Detalle, QBoton, Tab, Tabs } from "@olula/componentes/index.js";
import { EmitirEvento, Entidad } from "@olula/lib/diseño.js";
import { listaEntidadesInicial } from "@olula/lib/ListaEntidades.js";
import { useModelo } from "@olula/lib/useModelo.js";
import { useCallback, useEffect } from "react";
import { BorrarVentaTpv } from "../borrar/BorrarVentaTpv.tsx";
import { BorrarPagoVentaTpv } from "../borrar_pago/BorrarPagoVentaTpv.tsx";
import { DevolverVentaTpv } from "../devolver/DevolverVentaTpv.tsx";
import { LineaFactura, PagoVentaTpv, VentaTpv } from "../diseño.ts";
import { ventaTpvVacia } from "../dominio.ts";
import { getReportVenta } from "../infraestructura.ts";
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
    id,
    publicar = async () => {},
}: {
    id?: string;
    publicar?: EmitirEvento;
}) => {

    const contextoInicial: ContextoVentaTpv = {
        estado: 'INICIAL',
        venta: ventaTpvVacia,
        pagos: listaEntidadesInicial<PagoVentaTpv>(),
        lineas: listaEntidadesInicial<LineaFactura>(),
    }

    const { ctx, emitir } = useMaquina(
        getMaquina,
        contextoInicial,
        publicar
    )

    const autoGuardar = useCallback(async (venta: VentaTpv) => {
        await guardarVenta(ctx, venta);
        await emitir("venta_guardada");
    }, [ctx, emitir]);

    const modeloVenta = useModelo(metaVentaTpv, ctx.venta, autoGuardar);

    useEffect(() => {
        emitir("venta_id_cambiada", id, true);
    }, [id]);

    if (!ctx.venta.id) return;

    const imprimir = async () => {
        const blob = await getReportVenta(ctx.venta.id);
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
    }

    const { estado, pagos, lineas, venta } = ctx;

    const titulo = (venta: Entidad) => venta.codigo as string;

    return (
        <Detalle
            id={id}
            obtenerTitulo={titulo}
            setEntidad={() => {}}
            entidad={venta}
            cerrarDetalle={() => emitir("venta_deseleccionada", null, true)}
        >
            <div className="DetalleFactura">
                <div className="botones maestro-botones ">
                    { estado !== "EMITIDA" && (
                        <QBoton texto='Borrar venta'
                            onClick={() => emitir("borrar_solicitado")}
                        />
                    )}
                    <QBoton texto='Imprimir'
                        onClick={imprimir}
                    />
                </div>
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
        </Detalle>
    );
};
