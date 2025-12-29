import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento, Entidad, ListaSeleccionable } from "@olula/lib/diseño.ts";
import { cargar, seleccionarItem } from "@olula/lib/entidad.js";
import { calcularEstado, ConfigMaquina5 } from "@olula/lib/useMaquina.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { TotalesVenta } from "../../../venta/vistas/TotalesVenta.tsx";
import { PagoVentaTpv, VentaTpv } from "../../diseño.ts";
import { metaVentaTpv, ventaTpvVacia } from "../../dominio.ts";
import {
    getPagos,
    getVenta,
    patchFactura
} from "../../infraestructura.ts";
import { BajaVentaTpv } from "./BajaVentaTpv.tsx";
import "./DetalleVentaTpv.css";
import { Lineas } from "./Lineas/Lineas.tsx";
import { AltaPagoEfectivo } from "./Pagos/AltaPagoEfectivo.tsx";
import { AltaPagoTarjeta } from "./Pagos/AltaPagoTarjeta.tsx";
import { BajaPago } from "./Pagos/BajaPago.tsx";
import { Pagos } from "./Pagos/Pagos.tsx";
import { PendienteVenta } from "./PendienteVenta.tsx";
import { TabCliente } from "./TabCliente/TabCliente.tsx";
import { TabDatos } from "./TabDatos.tsx";


export type EstadoVentaTpv = (
  "ABIERTA" | "BORRANDO_VENTA" | "PAGANDO_EFECTIVO"
  | "BORRANDO_PAGO" | "PAGANDO_TARJETA" | "EMITIDA"
);

const abiertaOEmitida = (payload: unknown ) => {
    const venta = payload as VentaTpv;
    return venta.abierta ? "ABIERTA" : "EMITIDA";
}

const maquina: ConfigMaquina5<EstadoVentaTpv> = {
    estados: {
        ABIERTA: {
            guardar_iniciado: "ABIERTA",
            cliente_venta_cambiado: "ABIERTA",
            borrar_solicitado: "BORRANDO_VENTA",
            pago_efectivo_solicitado: "PAGANDO_EFECTIVO",
            pago_tarjeta_solicitado: "PAGANDO_TARJETA",
            borrar_pago_solicitado: "BORRANDO_PAGO",
            pagos_cargados: "ABIERTA",
            venta_cargada: abiertaOEmitida
        },

        EMITIDA: {
            venta_cargada: abiertaOEmitida
        },

        BORRANDO_VENTA: {
            venta_borrada: "ABIERTA",
            borrar_cancelado: "ABIERTA",
        },

        PAGANDO_EFECTIVO: {
            pago_creado: "ABIERTA",
            pago_cancelado: "ABIERTA",
        },

        PAGANDO_TARJETA: {
            pago_creado: "ABIERTA",
            pago_cancelado: "ABIERTA",
        },

        BORRANDO_PAGO: {
            pago_borrado: "ABIERTA",
            pago_borrado_cancelado: "ABIERTA",
        },
    },
};


export const DetalleVentaTpv = ({
    ventaInicial = null,
    publicar = () => {},
}: {
    ventaInicial?: VentaTpv | null;
    publicar?: EmitirEvento;
}) => {
    const params = useParams();
    const { intentar } = useContext(ContextoError);

    const [pagos, setPagos] = useState<ListaSeleccionable<PagoVentaTpv>>({ lista:[], idActivo: null });
    const [estado, setEstado] = useState<EstadoVentaTpv>("ABIERTA");

    const ventaId = ventaInicial?.id ?? params.id;
    const titulo = (venta: Entidad) => venta.codigo as string;

    const venta = useModelo(metaVentaTpv, ventaTpvVacia);
    const { modelo, init } = venta;

    const recargarPagos = useCallback(
        async (idActivo: string | undefined = undefined) => {
            const nuevosPagos = ventaId
                ? await intentar(() => getPagos(ventaId))
                : [];
            setPagos(cargar(nuevosPagos, idActivo));
        } ,
        [ventaId, setPagos, intentar, getPagos]
    );
    
    const procesarEstado = useCallback(
        (evento: string, payload?: unknown) => {
            const nuevoEstado = calcularEstado(maquina, estado, evento, payload); 
            if (nuevoEstado !== estado) setEstado(nuevoEstado);
        },
        [estado, setEstado]
    );
    console.log("Estado UI:", estado);

    const recargarCabecera = useCallback(
        async () => {
            const nuevaVenta = await getVenta(modelo.id);
            init(nuevaVenta);
            procesarEstado("venta_cargada", nuevaVenta);
            publicar("venta_cambiada", nuevaVenta);
        },
        [init, getVenta, modelo, procesarEstado]
    );
 
    const postEvento = useCallback(
        async (evento: string, payload?: unknown) => {

            switch (evento) {
                case "pagos_cargados":
                case "pago_borrado":
                    await recargarPagos();
                    await recargarCabecera();
                    break;

                case "pago_creado":
                    await recargarPagos(payload as string);
                    await recargarCabecera();
                    break;
                
                case "pago_seleccionado": {
                    setPagos(seleccionarItem(payload as PagoVentaTpv));
                    break;
                }

                case "venta_borrada":
                    publicar("factura_borrada");
                    break;
            }
        },
        [recargarPagos, recargarCabecera, setPagos, publicar]
    );

    const emitir = useCallback(
        async (evento: string, payload?: unknown) => {
            procesarEstado(evento, payload);
            postEvento(evento, payload);
        },
        [procesarEstado, postEvento]
    );

    const getVentaUI = useCallback(
        async (id: string) => {
            const nuevaVenta = await getVenta(id);
            emitir("venta_cargada", nuevaVenta);
            return nuevaVenta;
        },
        [init, getVenta, emitir]
    );

    const guardar = async () => {
        await intentar(() => patchFactura(modelo.id, modelo));
        await recargarCabecera();
    };

    const cancelar = () => {
        init();
        publicar("cancelar_seleccion");
    };

    useEffect(() => {
        const cargarPagos = async () => {
            const nuevosPagos = ventaId
            ? await intentar(() => getPagos(ventaId))
            : [];

            setPagos(cargar(nuevosPagos));
        };
        cargarPagos();
    }, [ventaId, intentar, getPagos, setPagos]);
  

    return (
        <Detalle
            id={ventaId}
            obtenerTitulo={titulo}
            setEntidad={(f) => init(f)}
            entidad={modelo}
            cargar={getVentaUI}   
            cerrarDetalle={cancelar}
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
                        total={Number(modelo.total ?? 0)}
                        divisa={String(modelo.coddivisa ?? "EUR")}
                        pagado={Number(modelo.pagado ?? 0)}
                    />
                    )}
                <Lineas
                    onCabeceraModificada={recargarCabecera}
                    facturaId={ventaId}
                    facturaEditable={true}
                    estadoVenta={estado}
                />
                <BajaVentaTpv
                    publicar={emitir}
                    activo={estado === "BORRANDO_VENTA"}
                    idVenta={ventaId}
                    // refrescarCabecera={refrescarCabecera}
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
            </div>
        )}
        </Detalle>
    );
};
