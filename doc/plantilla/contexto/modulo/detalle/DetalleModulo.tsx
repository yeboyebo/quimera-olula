import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.js";
import { useCallback, useEffect } from "react";
import { BorrarModulo } from "../borrar/BorrarModulo.tsx";
import { Modulo } from "../diseño.ts";
import "./DetalleModulo.css";
import { guardarModulo, metaModulo, moduloVacio } from "./dominio.ts";
import { getMaquina } from "./maquina.ts";
import { TabGeneral } from "./TabGeneral.tsx";
import { TabInformacion } from "./TabInformacion.tsx";

/**
 * Componente detalle.
 *
 * Recibe el ID como prop (string | undefined), no la entidad completa.
 * La máquina carga la entidad cuando cambia el ID.
 *
 * Patrón auto-guardado:
 *   useModelo(meta, entidad, onGuardado) → el tercer argumento es un callback
 *   que se invoca cuando el modelo tiene cambios válidos y el usuario deja de editar.
 *   Llama a la API y emite el evento de resultado a la máquina.
 *
 * Patrón modales condicionales:
 *   Los modales se renderizan condicionalmente según ctx.estado.
 *   No existe estado EDITANDO separado; el formulario siempre está activo
 *   y se deshabilita si metaModulo.editable devuelve false.
 */
export const DetalleModulo = ({
    id,
    publicar = async () => {},
}: {
    id?: string;
    publicar?: EmitirEvento;
}) => {
    const { ctx, emitir } = useMaquina(
        getMaquina,
        {
            estado: "INICIAL",
            modulo: moduloVacio(),
        },
        publicar
    );

    // Auto-guardado: se llama cuando el modelo cambia y es válido
    const autoGuardar = useCallback(
        async (modulo: Modulo) => {
            await guardarModulo(ctx, modulo);
            await emitir("modulo_guardado");
        },
        [ctx, emitir]
    );

    const modelo = useModelo(metaModulo, ctx.modulo, autoGuardar);

    // Recargar cuando el ID cambia (o se deselecciona con undefined)
    useEffect(() => {
        emitir("modulo_id_cambiado", id, true);
    }, [id]);

    if (!ctx.modulo.id) return null;

    const titulo = (m: Modulo) => m.nombre as string;

    return (
        <Detalle
            id={id}
            obtenerTitulo={titulo}
            setEntidad={() => {}}
            entidad={ctx.modulo}
            cerrarDetalle={() => emitir("modulo_deseleccionado", null, true)}
        >
            <div className="DetalleModulo">
                <div className="maestro-botones">
                    <QBoton onClick={() => emitir("borrado_solicitado")}>
                        Borrar
                    </QBoton>
                </div>
                <Tabs
                    children={[
                        <Tab
                            key="tab-general"
                            label="General"
                            children={<TabGeneral form={modelo} />}
                        />,
                        <Tab
                            key="tab-info"
                            label="Información"
                            children={<TabInformacion modulo={ctx.modulo} />}
                        />,
                    ]}
                />
            </div>

            {/* Modales condicionales: se activan según el estado de la máquina */}
            {ctx.estado === "BORRANDO" && (
                <BorrarModulo
                    moduloId={ctx.modulo.id}
                    moduloNombre={ctx.modulo.nombre}
                    publicar={emitir}
                    onCancelar={() => emitir("borrado_cancelado")}
                />
            )}
        </Detalle>
    );
};
