import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { QuimeraAcciones } from "@olula/componentes/moleculas/qacciones.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useEffect } from "react";
import { BorrarAlbaran } from "../borrar/BorrarAlbaran.tsx";
import { Albaran } from "../diseño.ts";
import { albaranFacturado } from "../dominio.ts";
import {
    contextoDetalleAlbaranInicial,
    guardarAlbaran,
    metaAlbaran,
} from "./detalle.ts";
import "./DetalleAlbaran.css";
import { LineasAlbaran } from "./lineas/LineasAlbaran.tsx";
import { getMaquina } from "./maquina.ts";
import { TabDatos } from "./TabDatos.tsx";
import { TabObservaciones } from "./TabObservaciones.tsx";
import { TabProveedor } from "./TabProveedor.tsx";
import { TotalesAlbaran } from "./TotalesAlbaran.tsx";

export const DetalleAlbaran = ({
    id,
    publicar = async () => {},
}: {
    id?: string;
    publicar?: EmitirEvento;
}) => {
    const { ctx, emitir } = useMaquina(getMaquina, contextoDetalleAlbaranInicial, publicar);

    const autoGuardar = useCallback(
        async (albaran: Albaran) => {
            await guardarAlbaran(ctx, albaran);
            await emitir("albaran_guardado");
        },
        [ctx, emitir]
    );

    const formModelo = useModelo(metaAlbaran, ctx.albaran, autoGuardar);

    const { estado, albaran, lineas } = ctx;

    useEffect(() => {
        emitir("albaran_id_cambiado", id, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (!albaran.id) return null;

    const titulo = (a: Albaran) =>
        `${a.codigo}${a.nombreProveedor ? ` · ${a.nombreProveedor}` : ""}`;

    // Un albarán facturado no se puede borrar: el servidor responde 409.
    const accionesAlbaran = [
        {
            icono: "eliminar",
            texto: "Borrar",
            onClick: () => emitir("borrado_solicitado"),
            advertencia: true,
            deshabilitado: albaranFacturado(albaran),
        },
    ];

    return (
        <Detalle
            id={id}
            obtenerTitulo={titulo}
            setEntidad={() => {}}
            entidad={albaran}
            cerrarDetalle={() => emitir("albaran_deseleccionado", null, true)}
        >
            <div className="DetalleAlbaran">
                <div className="maestro-botones">
                    <QuimeraAcciones acciones={accionesAlbaran} vertical />
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
                <TotalesAlbaran form={formModelo} />
                <LineasAlbaran
                    albaran={albaran}
                    lineas={lineas}
                    estado={estado}
                    publicar={emitir}
                />
            </div>

            {estado === "BORRANDO" && (
                <BorrarAlbaran albaran={albaran} publicar={emitir} />
            )}
        </Detalle>
    );
};
