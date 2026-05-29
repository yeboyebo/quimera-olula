import { plugin } from "../dominio.ts";
import {
    AUTH_STORAGE_CHANGED_EVENT,
    AUTH_STORAGE_KEYS,
} from "./auth_storage_events.ts";
import {
    ServerSentEventsClient,
    SseHandler,
} from "./server_sent_events_client.ts";
import { tokenAcceso } from "./token_acceso.ts";

type SessionSseEvents = Record<string, unknown>;

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");
const SSE_URL = `${API_BASE_URL}/comun/eventos_sse`;

let retainCount = 0;
let listenersBootstrapped = false;
let releaseSessionClient: (() => void) | null = null;

const sessionClient = new ServerSentEventsClient(SSE_URL, {
    withCredentials: true,
    getHeaders: () => {
        const token = tokenAcceso.obtener();
        return token ? { Authorization: `Bearer ${token}` } : undefined;
    },
});

const hasActiveSession = () => {
    return !!(
        localStorage.getItem("token-acceso") ||
        localStorage.getItem("token-refresco")
    );
};

const isSsePluginEnabled = () => plugin("eventos_sse") === "activo";

const shouldKeepConnected = () => {
    return retainCount > 0 && hasActiveSession() && isSsePluginEnabled();
};

const syncSessionConnectionState = () => {
    if (shouldKeepConnected()) {
        if (!releaseSessionClient) {
            releaseSessionClient = sessionClient.retain();
        }
        return;
    }

    if (releaseSessionClient) {
        releaseSessionClient();
        releaseSessionClient = null;
    }
};

const bootstrapSessionListeners = () => {
    if (listenersBootstrapped) return;
    listenersBootstrapped = true;

    window.addEventListener("storage", (event) => {
        if (!event.key) {
            syncSessionConnectionState();
            return;
        }

        if (AUTH_STORAGE_KEYS.includes(event.key as (typeof AUTH_STORAGE_KEYS)[number])) {
            syncSessionConnectionState();
        }
    });

    window.addEventListener(AUTH_STORAGE_CHANGED_EVENT, () => {
        syncSessionConnectionState();
    });
};

export const retainGlobalServerSentEventsConnection = () => {
    retainCount += 1;
    bootstrapSessionListeners();
    syncSessionConnectionState();

    return () => {
        retainCount = Math.max(0, retainCount - 1);
        syncSessionConnectionState();
    };
};

export const onGlobalServerSentEvent = <K extends keyof SessionSseEvents & string>(
    eventType: K,
    handler: SseHandler
) => {
    return sessionClient.on(eventType, handler);
};

export const reconnectGlobalServerSentEventsConnection = () => {
    sessionClient.reconnect();
    syncSessionConnectionState();
};

export const closeGlobalServerSentEventsConnection = () => {
    retainCount = 0;
    syncSessionConnectionState();
};
