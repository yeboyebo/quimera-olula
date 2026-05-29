import { fetchEventSource } from "@microsoft/fetch-event-source";

export type SseHandler = (event: MessageEvent) => void;

type SseOptions = {
    withCredentials?: boolean;
    getHeaders?: () => Record<string, string> | undefined;
};

export class ServerSentEventsClient {
    private abortController: AbortController | null = null;
    private refs = 0;
    private readonly listeners = new Map<string, Set<SseHandler>>();

    constructor(
        private readonly url: string | (() => string),
        private readonly options: SseOptions = {}
    ) { }

    retain(): () => void {
        this.refs += 1;
        this.sync();
        return () => this.release();
    }

    release(): void {
        this.refs = Math.max(0, this.refs - 1);
        this.sync();
    }

    reconnect(): void {
        this.close();
        this.sync();
    }

    on(eventType: string, handler: SseHandler): () => void {
        const set = this.listeners.get(eventType) ?? new Set<SseHandler>();
        set.add(handler);
        this.listeners.set(eventType, set);

        return () => this.off(eventType, handler);
    }

    off(eventType: string, handler: SseHandler): void {
        const set = this.listeners.get(eventType);
        if (!set) return;

        set.delete(handler);
        if (set.size > 0) return;

        this.listeners.delete(eventType);
    }

    private sync(): void {
        if (this.refs > 0) return this.open();
        this.close();
    }

    private open(): void {
        if (this.abortController) return;

        const resolvedUrl = typeof this.url === "function" ? this.url() : this.url;
        const abortController = new AbortController();
        this.abortController = abortController;

        void fetchEventSource(resolvedUrl, {
            method: "GET",
            headers: this.options.getHeaders?.(),
            credentials: this.options.withCredentials ? "include" : "same-origin",
            signal: abortController.signal,
            openWhenHidden: true,
            onopen: async (response) => {
                if (response.status === 401 || response.status === 403) {
                    abortController.abort();
                    throw new Error(`SSE auth error: ${response.status}`);
                }
            },
            onmessage: (message) => {
                const eventType = message.event || "message";
                const handlers = this.listeners.get(eventType);
                if (!handlers) return;

                const event = new MessageEvent(eventType, {
                    data: message.data,
                    lastEventId: message.id,
                });

                for (const handler of handlers) {
                    handler(event);
                }
            },
            onerror: () => {
                // Throwing stops fetch-event-source retries.
                if (this.refs <= 0 || abortController.signal.aborted) {
                    throw new Error("SSE connection stopped");
                }
                // Otherwise let fetch-event-source retry with built-in backoff.
            },
        }).catch(() => {
            // Errors are handled by onerror/onopen above.
        }).finally(() => {
            if (this.abortController === abortController) {
                this.abortController = null;
            }
            // No manual reopen here — fetch-event-source already retries via onerror.
        });
    }

    private close(): void {
        if (!this.abortController) return;
        this.abortController.abort();
        this.abortController = null;
    }
}
