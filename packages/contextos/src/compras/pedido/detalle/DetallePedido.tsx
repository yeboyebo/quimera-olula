import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { QuimeraAcciones } from "@olula/componentes/moleculas/qacciones.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useEffect } from "react";
import { BorrarPedido } from "../borrar/BorrarPedido.tsx";
import { Pedido } from "../diseño.ts";
import { pedidoPendiente } from "../dominio.ts";
import {
    contextoDetallePedidoInicial,
    guardarPedido,
    metaPedido,
} from "./detalle.ts";
import "./DetallePedido.css";
import { LineasPedido } from "./lineas/LineasPedido.tsx";
import { getMaquina } from "./maquina.ts";
import { TabDatos } from "./TabDatos.tsx";
import { TabProveedor } from "./TabProveedor.tsx";
import { TotalesPedido } from "./TotalesPedido.tsx";
import { TabObservaciones } from "./TabObservaciones.tsx";

export const DetallePedido = ({
    id,
    publicar = async () => {},
}: {
    id?: string;
    publicar?: EmitirEvento;
}) => {
    const { ctx, emitir } = useMaquina(getMaquina, contextoDetallePedidoInicial, publicar);

    const autoGuardar = useCallback(
        async (pedido: Pedido) => {
            await guardarPedido(ctx, pedido);
            await emitir("pedido_guardado");
        },
        [ctx, emitir]
    );

    const formModelo = useModelo(metaPedido, ctx.pedido, autoGuardar);

    const { estado, pedido, lineas } = ctx;

    useEffect(() => {
        emitir("pedido_id_cambiado", id, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (!pedido.id) return null;

    const titulo = (p: Pedido) =>
        `${p.codigo}${p.nombreProveedor ? ` · ${p.nombreProveedor}` : ""}`;

    // Un pedido que no está pendiente no se puede borrar: el servidor responde 409.
    const accionesPedido = [
        {
            icono: "eliminar",
            texto: "Borrar",
            onClick: () => emitir("borrado_solicitado"),
            advertencia: true,
            deshabilitado: !pedidoPendiente(pedido),
        },
    ];

    return (
        <Detalle
            id={id}
            obtenerTitulo={titulo}
            setEntidad={() => {}}
            entidad={pedido}
            cerrarDetalle={() => emitir("pedido_deseleccionado", null, true)}
        >
            <div className="DetallePedido">
                <div className="maestro-botones">
                    <QuimeraAcciones acciones={accionesPedido} vertical />
                </div>
                <Tabs
                    children={[
                        <Tab
                            key="tab-proveedor"
                            label="Proveedor"
                            children={<TabProveedor form={formModelo} />}
                        />,
                        <Tab
                            key="tab-datos"
                            label="Datos"
                            children={<TabDatos form={formModelo} />}
                        />,
                        <Tab
                            key="tab-observaciones"
                            label="Observaciones"
                            children={<TabObservaciones form={formModelo} />}
                        />,
                    ]}
                />
                <TotalesPedido form={formModelo} />
                <LineasPedido
                    pedido={pedido}
                    lineas={lineas}
                    estado={estado}
                    publicar={emitir}
                />
            </div>

            {estado === "BORRANDO" && (
                <BorrarPedido pedido={pedido} publicar={emitir} />
            )}
        </Detalle>
    );
};
