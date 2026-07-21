import { puede } from "@olula/lib/dominio.ts";
import { ElementoMenu, ElementoMenuPadre } from "@olula/lib/menu.ts";
import { AccionNavegacion, Capacidad, EventoStreamIa, MensajeAsistente, RespuestaIa } from "#/asistente/diseño.ts";

export const construirUrlNavegacion = (accion: AccionNavegacion): string => {
    // El LLM decide `ruta` en tiempo real (ver enlaceFila en el asistente) y a veces se
    // inventa un placeholder o query string propios (ej. "/ventas/pedido?id={id}") en
    // vez de una ruta limpia — se descarta cualquier "?..." que ya traiga para no acabar
    // con dos querystrings concatenadas.
    const ruta = accion.ruta.split("?")[0];
    if (!accion.parametros || Object.keys(accion.parametros).length === 0) return ruta;
    return `${ruta}?${new URLSearchParams(accion.parametros).toString()}`;
};

export const construirCapacidades = (menu: ElementoMenu[]): Capacidad[] => {
    const hojas = menu.flatMap(item =>
        "subelementos" in item ? (item as ElementoMenuPadre).subelementos : [item]
    );

    return hojas
        .filter(hoja => Boolean(hoja.descripcionIA))
        .filter(hoja => !hoja.regla || puede(hoja.regla))
        .map(hoja => ({
            ruta: hoja.url,
            descripcion: hoja.descripcionIA!,
            parametros: hoja.parametrosIA,
            regla: hoja.regla,
        }));
};

export const normalizarRespuestaIa = (raw: Record<string, unknown>): RespuestaIa => ({
    respuesta: String(raw.respuesta ?? ""),
    threadId: String(raw.thread_id ?? ""),
    a2uiMessages: Array.isArray(raw.a2ui_messages) ? raw.a2ui_messages : [],
    capacidadesHash: (raw.capacidades_hash as string | null | undefined) ?? null,
    necesitaCapacidades: Boolean(raw.necesita_capacidades),
    accionNavegacion: (raw.accion_navegacion as RespuestaIa["accionNavegacion"]) ?? null,
});

export const mensajeVacio = (id: string, rol: MensajeAsistente["rol"]): MensajeAsistente => ({
    id,
    rol,
    texto: "",
});

export const eventoStreamDesdeApi = (raw: Record<string, unknown>): EventoStreamIa => {
    switch (raw.tipo) {
        case "delta":
            return { tipo: "delta", contenido: String(raw.contenido ?? "") };
        case "a2ui":
            return { tipo: "a2ui", a2uiMessage: raw.a2ui_message };
        case "accion_navegacion":
            return { tipo: "accion_navegacion", accionNavegacion: raw.accion_navegacion as AccionNavegacion };
        case "fin":
            return {
                tipo: "fin",
                threadId: String(raw.thread_id ?? ""),
                necesitaCapacidades: Boolean(raw.necesita_capacidades),
            };
        case "error":
        default:
            return { tipo: "error", contenido: String(raw.contenido ?? "Error desconocido del asistente") };
    }
};
