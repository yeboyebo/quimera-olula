import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type PropsWithChildren,
} from "react";
import {
    AssistantRuntimeProvider,
    useExternalStoreRuntime,
    type AppendMessage,
    type ThreadMessageLike,
} from "@assistant-ui/react";
import { MessageProcessor } from "@a2ui/web_core/v0_9";
import type { SurfaceModel } from "@a2ui/web_core/v0_9";
import type { ReactComponentImplementation } from "@a2ui/react/v0_9";
import { FactoryCtx } from "@olula/lib/factory_ctx.tsx";
import { catalogoAsistente } from "#/asistente/vistas/catalogo/catalogo.ts";
import { consultarIa, consultarIaStream, enviarAccionA2ui } from "#/asistente/infraestructura.ts";
import { construirCapacidades, mensajeVacio } from "#/asistente/dominio.ts";
import { getMockRespuestaIa } from "#/asistente/vistas/mocks/a2ui_mocks.ts";
import type { A2uiClientAction, AccionNavegacion, ConsultaIa, MensajeAsistente, RespuestaIa } from "#/asistente/diseño.ts";

const ASISTENTE_MOCK_ENABLED = import.meta.env.VITE_ASISTENTE_MOCK === "true";

interface AsistenteContextValue {
    isRunning: boolean;
    enviarMensaje: (texto: string) => Promise<void>;
    cancelarMensaje: () => void;
    streamingEnabled: boolean;
    setStreamingEnabled: (v: boolean) => void;
    a2uiSurfaces: SurfaceModel<ReactComponentImplementation>[];
    messageSurfaceMap: Record<string, string[]>;
    enviarAccion: (accion: A2uiClientAction) => Promise<void>;
}

const AsistenteContext = createContext<AsistenteContextValue | null>(null);

export function useAsistenteContext(): AsistenteContextValue {
    const ctx = useContext(AsistenteContext);
    if (!ctx) throw new Error("useAsistenteContext debe usarse dentro de AsistenteRuntimeProvider");
    return ctx;
}

let contador = 0;
const nuevoId = () => `asistente-msg-${++contador}`;

const textoDe = (msg: AppendMessage): string =>
    msg.content
        .filter((p): p is { type: "text"; text: string } => p.type === "text")
        .map(p => p.text)
        .join("\n");

const crearProcessor = (
    onAction: (accion: A2uiClientAction) => void
): MessageProcessor<ReactComponentImplementation> => new MessageProcessor([catalogoAsistente], onAction);

interface Props {
    /** Ejecuta una acción de navegación decidida por el asistente (la app decide cómo navegar). */
    onAccionNavegacion?: (accion: AccionNavegacion) => void;
}

export function AsistenteRuntimeProvider({ children, onAccionNavegacion }: PropsWithChildren<Props>) {
    const { menu } = useContext(FactoryCtx);
    const capacidades = useMemo(() => construirCapacidades(menu), [menu]);

    const [mensajes, setMensajes] = useState<MensajeAsistente[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [streamingEnabled, setStreamingEnabled] = useState(false);
    const [a2uiSurfaces, setA2uiSurfaces] = useState<SurfaceModel<ReactComponentImplementation>[]>([]);
    const [messageSurfaceMap, setMessageSurfaceMap] = useState<Record<string, string[]>>({});

    const threadIdRef = useRef<string | null>(null);
    // Hash de capacidades calculado por el SERVIDOR — se guarda tal cual y se reenvía
    // en los siguientes mensajes del thread; nunca se recalcula en el cliente.
    const capacidadesHashRef = useRef<string | null>(null);
    const currentMessageIdRef = useRef<string | null>(null);
    const abortRef = useRef<AbortController | null>(null);
    const actionHandlerRef = useRef<(accion: A2uiClientAction) => void>(() => {});

    const [a2uiProcessor] = useState<MessageProcessor<ReactComponentImplementation>>(() =>
        crearProcessor(accion => actionHandlerRef.current(accion))
    );

    useEffect(() => {
        const subCreated = a2uiProcessor.onSurfaceCreated(surface => {
            setA2uiSurfaces(prev => [...prev, surface]);
            const messageId = currentMessageIdRef.current;
            if (messageId) {
                setMessageSurfaceMap(prev => ({
                    ...prev,
                    [messageId]: [...(prev[messageId] ?? []), surface.id],
                }));
            }
        });
        const subDeleted = a2uiProcessor.onSurfaceDeleted(id => {
            setA2uiSurfaces(prev => prev.filter(s => s.id !== id));
            setMessageSurfaceMap(prev => {
                const next = { ...prev };
                for (const [msgId, surfaceIds] of Object.entries(next)) {
                    const filtrados = surfaceIds.filter(sid => sid !== id);
                    if (filtrados.length === 0) delete next[msgId];
                    else next[msgId] = filtrados;
                }
                return next;
            });
        });
        return () => {
            subCreated.unsubscribe();
            subDeleted.unsubscribe();
        };
    }, [a2uiProcessor]);

    const convertMessage = useCallback(
        (msg: MensajeAsistente): ThreadMessageLike => ({
            id: msg.id,
            role: msg.rol,
            content: [{ type: "text", text: msg.texto }],
        }),
        []
    );

    const procesarMensajesA2ui = useCallback(
        (mensajesA2ui: unknown[], messageId?: string) => {
            if (!mensajesA2ui.length) return;

            const normalizados: unknown[] = [];
            for (const msg of mensajesA2ui) {
                const m = msg as Record<string, unknown>;
                if (m.createSurface) {
                    const { surfaceId } = m.createSurface as { surfaceId: string };
                    if (a2uiProcessor.model.getSurface(surfaceId)) {
                        normalizados.push({ version: "v0.9", deleteSurface: { surfaceId } });
                    }
                }
                normalizados.push(msg);
            }

            currentMessageIdRef.current = messageId ?? null;
            try {
                a2uiProcessor.processMessages(
                    normalizados as Parameters<typeof a2uiProcessor.processMessages>[0]
                );
            } catch (err) {
                console.error("[asistente] Error al procesar mensajes a2ui:", err, normalizados);
            } finally {
                currentMessageIdRef.current = null;
            }
        },
        [a2uiProcessor]
    );

    const construirConsulta = useCallback(
        (pregunta: string, forzarCapacidadesCompletas: boolean): ConsultaIa => {
            const threadId = threadIdRef.current;
            const hashConocido = capacidadesHashRef.current;
            return {
                pregunta,
                threadId,
                ...(hashConocido && !forzarCapacidadesCompletas
                    ? { capacidadesHash: hashConocido }
                    : { capacidades }),
            };
        },
        [capacidades]
    );

    const consultar = useCallback(
        async (consulta: ConsultaIa): Promise<RespuestaIa> =>
            ASISTENTE_MOCK_ENABLED ? getMockRespuestaIa(consulta) : consultarIa(consulta),
        []
    );

    const aplicarRespuesta = useCallback(
        (respuesta: RespuestaIa, assistantId: string) => {
            threadIdRef.current = respuesta.threadId;
            capacidadesHashRef.current = respuesta.capacidadesHash;
            setMensajes(prev => prev.map(m => (m.id === assistantId ? { ...m, texto: respuesta.respuesta } : m)));
            if (respuesta.a2uiMessages.length) {
                procesarMensajesA2ui(respuesta.a2uiMessages, assistantId);
            }
            if (respuesta.accionNavegacion) {
                onAccionNavegacion?.(respuesta.accionNavegacion);
            }
        },
        [onAccionNavegacion, procesarMensajesA2ui]
    );

    const procesarTexto = useCallback(
        async (texto: string) => {
            if (!texto.trim()) return;

            setMensajes(prev => [...prev, { id: nuevoId(), rol: "user", texto }]);
            setIsRunning(true);
            abortRef.current = new AbortController();

            try {
                if (streamingEnabled && !ASISTENTE_MOCK_ENABLED) {
                    const assistantId = nuevoId();
                    setMensajes(prev => [...prev, mensajeVacio(assistantId, "assistant")]);

                    let acumulado = "";
                    for await (const evento of consultarIaStream(
                        construirConsulta(texto, false),
                        abortRef.current.signal
                    )) {
                        if (evento.tipo === "delta") {
                            acumulado += evento.contenido;
                            setMensajes(prev => prev.map(m => (m.id === assistantId ? { ...m, texto: acumulado } : m)));
                        } else if (evento.tipo === "a2ui") {
                            procesarMensajesA2ui([evento.a2uiMessage], assistantId);
                        } else if (evento.tipo === "accion_navegacion") {
                            onAccionNavegacion?.(evento.accionNavegacion);
                        } else if (evento.tipo === "fin") {
                            threadIdRef.current = evento.threadId;
                        } else if (evento.tipo === "error") {
                            setMensajes(prev =>
                                prev.map(m => (m.id === assistantId ? { ...m, texto: `Error: ${evento.contenido}` } : m))
                            );
                        }
                    }
                } else {
                    const assistantId = nuevoId();
                    setMensajes(prev => [...prev, mensajeVacio(assistantId, "assistant")]);

                    let respuesta = await consultar(construirConsulta(texto, false));
                    if (respuesta.necesitaCapacidades) {
                        respuesta = await consultar({ ...construirConsulta(texto, true), threadId: respuesta.threadId });
                    }
                    aplicarRespuesta(respuesta, assistantId);
                }
            } catch (err) {
                if ((err as Error).name === "AbortError") return;
                setMensajes(prev => [
                    ...prev,
                    { id: nuevoId(), rol: "assistant", texto: `Error: ${(err as Error).message}` },
                ]);
            } finally {
                setIsRunning(false);
            }
        },
        [streamingEnabled, construirConsulta, consultar, aplicarRespuesta, procesarMensajesA2ui, onAccionNavegacion]
    );

    const onNew = useCallback(async (appendMsg: AppendMessage) => {
        await procesarTexto(textoDe(appendMsg));
    }, [procesarTexto]);

    const onCancel = useCallback(async () => {
        abortRef.current?.abort();
        setIsRunning(false);
    }, []);

    const enviarMensaje = useCallback((texto: string) => procesarTexto(texto), [procesarTexto]);

    const cancelarMensaje = useCallback(() => {
        abortRef.current?.abort();
        setIsRunning(false);
    }, []);

    const enviarAccion = useCallback(
        async (accion: A2uiClientAction) => {
            if (accion.name === "navegar") {
                // Navegación disparada por un click en una fila de Tabla (ver
                // catalogo/Tabla.tsx) — puramente client-side, sin ida y vuelta al
                // backend, a diferencia del resto de acciones a2ui.
                const { ruta, parametros } = accion.context as {
                    ruta?: string;
                    parametros?: Record<string, string>;
                };
                if (ruta) onAccionNavegacion?.({ ruta, parametros });
                return;
            }

            const pendingId = nuevoId();
            setMensajes(prev => [...prev, mensajeVacio(pendingId, "assistant")]);
            setIsRunning(true);
            try {
                const respuesta = ASISTENTE_MOCK_ENABLED
                    ? getMockRespuestaIa({ pregunta: accion.name, threadId: threadIdRef.current })
                    : await enviarAccionA2ui(accion, threadIdRef.current);

                if (respuesta.respuesta) {
                    aplicarRespuesta(respuesta, pendingId);
                } else {
                    setMensajes(prev => prev.filter(m => m.id !== pendingId));
                }
            } catch (err) {
                console.error("[asistente] Error al enviar acción a2ui:", err);
                setMensajes(prev => prev.filter(m => m.id !== pendingId));
            } finally {
                setIsRunning(false);
            }
        },
        [aplicarRespuesta, onAccionNavegacion]
    );

    useEffect(() => {
        actionHandlerRef.current = enviarAccion;
    }, [enviarAccion]);

    const runtime = useExternalStoreRuntime({
        isRunning,
        messages: mensajes,
        convertMessage,
        onNew,
        onCancel,
    });

    return (
        <AsistenteContext.Provider
            value={{
                isRunning,
                enviarMensaje,
                cancelarMensaje,
                streamingEnabled,
                setStreamingEnabled,
                a2uiSurfaces,
                messageSurfaceMap,
                enviarAccion,
            }}
        >
            <AssistantRuntimeProvider runtime={runtime}>{children}</AssistantRuntimeProvider>
        </AsistenteContext.Provider>
    );
}
