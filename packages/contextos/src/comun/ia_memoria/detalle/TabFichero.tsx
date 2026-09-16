import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QTextArea } from "@olula/componentes/atomos/qtextarea.tsx";
import { ArrastraSuelta } from "@olula/componentes/gestor_documentos/ArrastraSuelta.tsx";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useCallback, useState } from "react";
import { leerComoBase64 } from "../crear/crear.js";
import { IaMemoria } from "../diseño.js";
import { obtenerUrlDescargaFicheroIaMemoria, patchIaMemoriaDesdeFichero } from "../infraestructura.js";
import "./TabFichero.css";

interface TabFicheroProps {
    iaMemoria: IaMemoria;
    onReemplazado: () => void;
}

/**
 * Tab de una memoria con origen "fichero": el texto extraído se muestra de
 * solo lectura (editarlo a mano lo desincronizaría del fichero fuente sin
 * indicarlo en ningún sitio) — para corregirlo hay que reemplazar el fichero,
 * que re-extrae el texto y dispara un nuevo reindexado en el backend.
 */
export const TabFichero = ({ iaMemoria, onReemplazado }: TabFicheroProps) => {
    const [reemplazando, setReemplazando] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [descargando, setDescargando] = useState(false);

    const descargarOriginal = useCallback(
        async () => {
            setDescargando(true);
            try {
                const url = await obtenerUrlDescargaFicheroIaMemoria(iaMemoria.id);
                window.open(url, "_blank", "noopener,noreferrer");
            } finally {
                setDescargando(false);
            }
        },
        [iaMemoria.id]
    );

    const manejarArchivoSeleccionado: EmitirEvento = useCallback(
        async (evento, payload) => {
            if (evento !== "archivos_seleccionados") return;
            const [archivo] = payload as File[];
            if (!archivo) return;
            setCargando(true);
            try {
                const contenidoBase64 = await leerComoBase64(archivo);
                await patchIaMemoriaDesdeFichero(iaMemoria.id, {
                    nombreFichero: archivo.name,
                    tipoMime: archivo.type || "application/octet-stream",
                    contenidoBase64,
                });
                setReemplazando(false);
                onReemplazado();
            } finally {
                setCargando(false);
            }
        },
        [iaMemoria.id, onReemplazado]
    );

    return (
        <div className="TabFichero">
            <dl>
                <dt>Fichero</dt>
                <dd>{iaMemoria.nombreFichero || "-"}</dd>
            </dl>

            <div className="TabFichero-acciones">
                <QBoton
                    variante="borde"
                    onClick={descargarOriginal}
                    deshabilitado={descargando}
                >
                    Descargar original
                </QBoton>
                <QBoton
                    variante="borde"
                    onClick={() => setReemplazando(true)}
                    deshabilitado={cargando || reemplazando}
                >
                    Reemplazar fichero
                </QBoton>
            </div>

            {reemplazando && (
                <div className="TabFichero-reemplazo">
                    <ArrastraSuelta emitir={manejarArchivoSeleccionado} />
                    <QBoton variante="texto" onClick={() => setReemplazando(false)} deshabilitado={cargando}>
                        Cancelar
                    </QBoton>
                </div>
            )}

            <quimera-formulario>
                <QTextArea label="Contenido extraído" nombre="contenido" rows={12} valor={iaMemoria.contenido} soloLectura />
            </quimera-formulario>
        </div>
    );
};
