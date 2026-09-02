import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { QuimeraAcciones } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { puede } from "@olula/lib/dominio.ts";
import { useModelo } from "@olula/lib/useModelo.js";
import { useCallback, useEffect } from "react";
import { BorrarCredencialExterna } from "../borrar/BorrarCredencialExterna.js";
import { CredencialExterna } from "../diseño.js";
import { metaCredencialExterna } from "../dominio.js";
import { RotarCredencialExterna } from "../rotar/RotarCredencialExterna.js";
import { contextoDetalleCredencialExternaInicial, guardarCredencialExterna } from "./detalle.js";
import "./DetalleCredencialExterna.css";
import { getMaquina } from "./maquina.js";
import { TabGeneral } from "./TabGeneral.js";
import { TabInformacion } from "./TabInformacion.js";

/**
 * Componente detalle de una credencial de terceros.
 *
 * Recibe el ID como prop (string | undefined); la máquina carga la entidad
 * cuando cambia. El formulario se auto-guarda (nombre/proveedor únicamente —
 * ver metaCredencialExterna.editable, restringido por "comun.credencial_externa").
 */
export const DetalleCredencialExterna = ({
    id,
    publicar = async () => {},
}: {
    id?: string;
    publicar?: EmitirEvento;
}) => {

    const { ctx, emitir } = useMaquina(
        getMaquina,
        contextoDetalleCredencialExternaInicial,
        publicar
    );

    const autoGuardar = useCallback(
        async (credencial: CredencialExterna) => {
            await guardarCredencialExterna(ctx, credencial);
            await emitir("credencial_externa_guardada");
        },
        [ctx, emitir]
    );

    const formModelo = useModelo(metaCredencialExterna, ctx.credencial, autoGuardar);

    const { estado, credencial } = ctx;

    useEffect(() => {
        emitir("id_cambiado", id, true);
    }, [id]);

    if (!ctx.credencial.id) return null;

    const titulo = (m: CredencialExterna) => m.nombre;

    const acciones = [
        {
            texto: "Rotar credencial",
            onClick: () => emitir("rotacion_solicitada"),
            deshabilitado: !puede("comun.credencial_externa"),
        },
        {
            texto: credencial.activo ? "Desactivar" : "Activar",
            onClick: () => emitir("activo_alternado_solicitado"),
            deshabilitado: !puede("comun.credencial_externa"),
        },
        {
            texto: "Borrar",
            onClick: () => emitir("borrado_solicitado"),
            deshabilitado: !puede("comun.credencial_externa"),
            advertencia: true,
        },
    ];

    return (
        <Detalle
            id={id}
            obtenerTitulo={titulo}
            setEntidad={() => {}}
            entidad={ctx.credencial}
            cerrarDetalle={() => emitir("credencial_externa_deseleccionada", null, true)}
        >
            <div className="DetalleCredencialExterna">
                <QuimeraAcciones acciones={acciones} />
                <Tabs children={[
                    <Tab label="General"
                        key="tab-general"
                        children={<TabGeneral form={formModelo} />}
                    />,
                    <Tab label="Información"
                        key="tab-info"
                        children={<TabInformacion credencial={credencial} />}
                    />,
                ]} />
            </div>

            {estado === "BORRANDO" && (
                <BorrarCredencialExterna
                    credencial={ctx.credencial}
                    publicar={emitir}
                />
            )}

            {estado === "ROTANDO" && (
                <RotarCredencialExterna
                    credencial={ctx.credencial}
                    publicar={emitir}
                />
            )}
        </Detalle>
    );
};
