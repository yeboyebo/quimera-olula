/**
 * Contrato API del asistente IA (implementado por un backend externo a este repo).
 *
 * POST /comun/ia (y /comun/ia/stream para el equivalente en streaming):
 *   - `capacidades` va completo SOLO cuando `thread_id` es null (primer mensaje de un thread).
 *   - En mensajes siguientes del mismo thread se manda `capacidades_hash` en su lugar (nunca ambos).
 *     Ese hash lo calcula SIEMPRE el servidor (campo `capacidades_hash` de la respuesta) — el
 *     cliente solo lo guarda y lo reenvía tal cual, nunca lo calcula él mismo (evita divergencias
 *     de algoritmo entre JS/Python para el mismo contenido).
 *   - Si el backend no reconoce `capacidades_hash` (p.ej. cambiaron los permisos del usuario),
 *     responde `necesita_capacidades: true` y el frontend reintenta la misma pregunta mandando
 *     `capacidades` completas.
 *   - `accion_navegacion` y `a2ui_messages` pueden convivir con `respuesta` en la misma respuesta.
 *   - El backend decide internamente si la petición se resuelve con una `capacidad` (ruta/formulario
 *     propio de la app) o con una tool MCP; esa decisión y la ejecución MCP nunca cruzan este contrato.
 */

export interface Capacidad {
    ruta: string;
    descripcion: string;
    parametros?: Record<string, string>;
    regla?: string;
}

export interface AccionNavegacion {
    ruta: string;
    parametros?: Record<string, string>;
}

export interface ConsultaIa {
    pregunta: string;
    threadId: string | null;
    capacidades?: Capacidad[];
    capacidadesHash?: string;
    contextoApp?: { rutaActual?: string; app?: string };
}

export interface RespuestaIa {
    respuesta: string;
    threadId: string;
    a2uiMessages: unknown[];
    /** Calculado por el servidor — guardar y reenviar tal cual como `capacidadesHash`, nunca recalcular. */
    capacidadesHash: string | null;
    necesitaCapacidades: boolean;
    accionNavegacion: AccionNavegacion | null;
}

export interface A2uiClientAction {
    name: string;
    surfaceId: string;
    sourceComponentId: string;
    timestamp: string;
    context: Record<string, unknown>;
}

export type EventoStreamIa =
    | { tipo: "delta"; contenido: string }
    | { tipo: "a2ui"; a2uiMessage: unknown }
    | { tipo: "accion_navegacion"; accionNavegacion: AccionNavegacion }
    | { tipo: "fin"; threadId: string; necesitaCapacidades?: boolean }
    | { tipo: "error"; contenido: string };

export interface MensajeAsistente {
    id: string;
    rol: "user" | "assistant";
    texto: string;
}
