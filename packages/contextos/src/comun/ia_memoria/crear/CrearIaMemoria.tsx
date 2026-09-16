import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QTextArea } from "@olula/componentes/atomos/qtextarea.tsx";
import { QModal } from "@olula/componentes/index.js";
import { ArrastraSuelta } from "@olula/componentes/gestor_documentos/ArrastraSuelta.tsx";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useFocus } from "@olula/lib/useFocus.ts";
import { useForm } from "@olula/lib/useForm.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useState } from "react";
import { postIaMemoria, postIaMemoriaDesdeFichero } from "../infraestructura.js";
import "./CrearIaMemoria.css";
import { leerComoBase64, metaNuevaIaMemoria, nuevaIaMemoriaVacia } from "./crear.js";

type ModoAlta = "texto" | "fichero";

/**
 * Modal de alta de memoria del asistente de IA.
 *
 * Patrón:
 *   - El maestro lo renderiza condicionalmente cuando estado === "CREANDO".
 *   - Dos vías de alta que conviven: texto manual (formulario de siempre) o
 *     subir/importar un fichero (el backend extrae el texto).
 *   - Llama a postIaMemoria/postIaMemoriaDesdeFichero internamente y emite:
 *       "ia_memoria_creada" con el ID devuelto por la API (éxito)
 *       "alta_cancelada"    sin payload                     (cancelar)
 */
export const CrearIaMemoria = ({
    publicar,
}: {
    publicar: EmitirEvento;
}) => {
    const [modo, setModo] = useState<ModoAlta>("texto");
    const [fichero, setFichero] = useState<File | null>(null);
    const [tituloFichero, setTituloFichero] = useState("");

    const { modelo: iaMemoria, uiProps, valido } = useModelo(
        metaNuevaIaMemoria,
        nuevaIaMemoriaVacia
    );

    const crear_ = useCallback(
        async () => {
            if (modo === "fichero") {
                if (!fichero) return;
                const contenidoBase64 = await leerComoBase64(fichero);
                const id = await postIaMemoriaDesdeFichero({
                    titulo: tituloFichero || undefined,
                    nombreFichero: fichero.name,
                    tipoMime: fichero.type || "application/octet-stream",
                    contenidoBase64,
                });
                publicar("ia_memoria_creada", id);
                return;
            }
            const id = await postIaMemoria(iaMemoria);
            publicar("ia_memoria_creada", id);
        },
        [modo, fichero, tituloFichero, iaMemoria, publicar]
    );

    const cancelar_ = useCallback(
        () => publicar("alta_cancelada"),
        [publicar]
    );

    const [crear, cancelar] = useForm(crear_, cancelar_);

    const focus = useFocus();

    const manejarArchivoSeleccionado: EmitirEvento = useCallback(
        async (evento, payload) => {
            if (evento !== "archivos_seleccionados") return;
            const [archivo] = payload as File[];
            if (archivo) setFichero(archivo);
        },
        []
    );

    const validoAlta = modo === "texto" ? valido : Boolean(fichero);

    return (
        <QModal
            abierto={true}
            nombre="crearIaMemoria"
            titulo="Nueva memoria del asistente"
            onCerrar={cancelar}
        >
            <div className="CrearIaMemoria">
                <div className="CrearIaMemoria-modo">
                    <QBoton
                        variante={modo === "texto" ? "solido" : "borde"}
                        onClick={() => setModo("texto")}
                    >
                        Escribir texto
                    </QBoton>
                    <QBoton
                        variante={modo === "fichero" ? "solido" : "borde"}
                        onClick={() => setModo("fichero")}
                    >
                        Subir o importar fichero
                    </QBoton>
                </div>

                {modo === "texto" ? (
                    <quimera-formulario>
                        <QInput label="Título" {...uiProps("titulo")} ref={focus} />
                        <QTextArea label="Contenido" rows={8} {...uiProps("contenido")} />
                    </quimera-formulario>
                ) : (
                    <div className="CrearIaMemoria-fichero">
                        <quimera-formulario>
                            <QInput
                                label="Título (opcional)"
                                nombre="tituloFichero"
                                valor={tituloFichero}
                                onChange={(valor) => setTituloFichero(valor)}
                            />
                        </quimera-formulario>
                        {fichero ? (
                            <div className="CrearIaMemoria-fichero-seleccionado">
                                <span>{fichero.name}</span>
                                <QBoton variante="texto" onClick={() => setFichero(null)}>
                                    Quitar
                                </QBoton>
                            </div>
                        ) : (
                            <ArrastraSuelta emitir={manejarArchivoSeleccionado} />
                        )}
                    </div>
                )}

                <div className="botones maestro-botones">
                    <QBoton onClick={crear} deshabilitado={!validoAlta}>
                        Crear
                    </QBoton>
                </div>
            </div>
        </QModal>
    );
};
