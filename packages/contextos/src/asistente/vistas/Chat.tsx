import { useCallback, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import { MessagePrimitive, ThreadPrimitive, useMessage } from "@assistant-ui/react";
import { A2uiSurface, MarkdownContext } from "@a2ui/react/v0_9";
import { renderMarkdown } from "@a2ui/markdown-it";
import { IconBoltOff, IconPlayerStop, IconRobot, IconSend, IconUser, IconX } from "@tabler/icons-react";
import { useAsistenteContext } from "#/asistente/vistas/AsistenteRuntimeProvider.tsx";
import "./Chat.css";

interface Props {
    onCerrar?: () => void;
}

export function Chat({ onCerrar }: Props) {
    const [texto, setTexto] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const aplicarPlantilla = useCallback((plantilla: string) => {
        setTexto(plantilla);
        const textarea = textareaRef.current;
        if (!textarea) return;
        textarea.focus();
        requestAnimationFrame(() => {
            const inicio = plantilla.indexOf("[");
            const fin = plantilla.indexOf("]");
            if (inicio !== -1 && fin !== -1) {
                textarea.setSelectionRange(inicio, fin + 1);
            } else {
                textarea.setSelectionRange(plantilla.length, plantilla.length);
            }
        });
    }, []);

    return (
        <div className="asistente-chat">
            <header className="asistente-chat__header">
                <div className="asistente-chat__titulo">
                    <div className="asistente-chat__avatar">
                        <IconRobot size={16} />
                    </div>
                    <p className="asistente-chat__nombre">Asistente IA</p>
                </div>

                <div className="asistente-chat__header-acciones">
                    <button
                        type="button"
                        disabled
                        title="Streaming no disponible todavía en el backend"
                        className="asistente-chat__toggle"
                    >
                        <IconBoltOff size={12} />
                        Estándar
                    </button>
                    {onCerrar && (
                        <button type="button" aria-label="Cerrar asistente" className="asistente-chat__cerrar" onClick={onCerrar}>
                            <IconX size={16} />
                        </button>
                    )}
                </div>
            </header>

            <ThreadPrimitive.Root className="asistente-chat__hilo">
                <ThreadPrimitive.Viewport className="asistente-chat__viewport">
                    <ThreadPrimitive.Empty>
                        <EmptyState onSeleccionarSugerencia={aplicarPlantilla} />
                    </ThreadPrimitive.Empty>
                    <ThreadPrimitive.Messages components={{ UserMessage, AssistantMessage }} />
                </ThreadPrimitive.Viewport>
            </ThreadPrimitive.Root>

            <Compositor texto={texto} setTexto={setTexto} textareaRef={textareaRef} />
        </div>
    );
}

interface EmptyStateProps {
    onSeleccionarSugerencia: (plantilla: string) => void;
}

function EmptyState({ onSeleccionarSugerencia }: EmptyStateProps) {
    return (
        <div className="asistente-chat__vacio">
            <div className="asistente-chat__vacio-icono">
                <IconRobot size={28} />
            </div>
            <p className="asistente-chat__vacio-titulo">¿En qué puedo ayudarte?</p>
            <p className="asistente-chat__vacio-subtitulo">
                Puedo buscar información y realizar acciones en la aplicación por ti.
            </p>
            <div className="asistente-chat__sugerencias">
                {SUGERENCIAS.map(s => (
                    <button
                        key={s.etiqueta}
                        type="button"
                        className="asistente-chat__chip"
                        onClick={() => onSeleccionarSugerencia(s.plantilla)}
                    >
                        {s.etiqueta}
                    </button>
                ))}
            </div>
        </div>
    );
}

const SUGERENCIAS = [
    { etiqueta: "Busca un cliente", plantilla: "Busca el cliente [nombre o NIF]" },
    { etiqueta: "Busca un artículo", plantilla: "Busca el artículo [nombre o referencia]" },
    { etiqueta: "Crea un pedido", plantilla: "Crea un pedido para el cliente [nombre]" },
];

interface CompositorProps {
    texto: string;
    setTexto: (texto: string) => void;
    textareaRef: RefObject<HTMLTextAreaElement | null>;
}

function Compositor({ texto, setTexto, textareaRef }: CompositorProps) {
    const { isRunning, enviarMensaje, cancelarMensaje } = useAsistenteContext();

    const enviar = useCallback(async () => {
        const recortado = texto.trim();
        if (!recortado || isRunning) return;
        setTexto("");
        await enviarMensaje(recortado);
    }, [texto, isRunning, enviarMensaje, setTexto]);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                enviar();
            }
        },
        [enviar]
    );

    return (
        <div className="asistente-chat__compositor">
            <form
                onSubmit={e => {
                    e.preventDefault();
                    enviar();
                }}
                className="asistente-chat__form"
            >
                <textarea
                    ref={textareaRef}
                    value={texto}
                    onChange={e => setTexto(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    autoFocus
                    placeholder="Escribe un mensaje…"
                    disabled={isRunning}
                    className="asistente-chat__textarea"
                />

                {isRunning ? (
                    <button
                        type="button"
                        onClick={cancelarMensaje}
                        aria-label="Cancelar"
                        className="asistente-chat__boton asistente-chat__boton--cancelar"
                    >
                        <IconPlayerStop size={17} />
                    </button>
                ) : (
                    <button
                        type="submit"
                        disabled={!texto.trim()}
                        aria-label="Enviar"
                        className="asistente-chat__boton asistente-chat__boton--enviar"
                    >
                        <IconSend size={17} />
                    </button>
                )}
            </form>
        </div>
    );
}

function UserMessage() {
    return (
        <MessagePrimitive.Root className="asistente-chat__mensaje asistente-chat__mensaje--usuario">
            <div className="asistente-chat__burbuja-fila">
                <div className="asistente-chat__burbuja asistente-chat__burbuja--usuario">
                    <MessagePrimitive.Content
                        components={{ Text: ({ text }) => <span className="asistente-chat__texto-pre">{text}</span> }}
                    />
                </div>
                <div className="asistente-chat__avatar asistente-chat__avatar--usuario">
                    <IconUser size={13} />
                </div>
            </div>
        </MessagePrimitive.Root>
    );
}

function AssistantMessage() {
    return (
        <MessagePrimitive.Root className="asistente-chat__mensaje asistente-chat__mensaje--asistente">
            <div className="asistente-chat__burbuja-fila">
                <div className="asistente-chat__avatar">
                    <IconRobot size={13} />
                </div>
                <AssistantMessageContent />
            </div>
            <AssistantMessageA2ui />
        </MessagePrimitive.Root>
    );
}

function AssistantMessageA2ui() {
    const messageId = useMessage(m => m.id);
    const { a2uiSurfaces, messageSurfaceMap } = useAsistenteContext();

    const surfaceIds = messageSurfaceMap[messageId] ?? [];
    const surfaces = a2uiSurfaces.filter(s => surfaceIds.includes(s.id));

    if (surfaces.length === 0) return null;

    return (
        <MarkdownContext.Provider value={renderMarkdown}>
            <div className="asistente-chat__a2ui">
                {surfaces.map(surface => (
                    <A2uiSurface key={surface.id} surface={surface} />
                ))}
            </div>
        </MarkdownContext.Provider>
    );
}

function AssistantMessageContent() {
    const mostrarPuntos = useMessage(m => {
        if (m.status?.type !== "running") return false;
        const texto = m.content
            .filter(p => p.type === "text")
            .map(p => (p as { text: string }).text)
            .join("");
        return texto.length === 0;
    });

    return (
        <div className="asistente-chat__burbuja">
            {mostrarPuntos ? (
                <span className="asistente-chat__puntos">
                    <span className="asistente-chat__punto" style={{ animationDelay: "0ms" }} />
                    <span className="asistente-chat__punto" style={{ animationDelay: "200ms" }} />
                    <span className="asistente-chat__punto" style={{ animationDelay: "400ms" }} />
                </span>
            ) : (
                <MessagePrimitive.Content
                    components={{ Text: ({ text }) => <span className="asistente-chat__texto-pre">{text}</span> }}
                />
            )}
        </div>
    );
}
