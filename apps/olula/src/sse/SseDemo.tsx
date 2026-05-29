import {
  closeGlobalServerSentEventsConnection,
  onGlobalServerSentEvent,
  reconnectGlobalServerSentEventsConnection,
} from "@olula/lib/api/server_sent_events_session.ts";
import { useEffect, useState } from "react";
import "./SseDemo.css";

type EventosSse = {
  "sse.conectado": {
    mensaje?: string;
    total?: number;
  };
};

export const SseDemo = () => {
  const [ultimoEvento, setUltimoEvento] = useState<string>(
    "Sin eventos todavía"
  );

  useEffect(() => {
    const off = onGlobalServerSentEvent("sse.conectado", (event) => {
      const evento = JSON.parse(String(event.data ?? "{}")) as
        | EventosSse["sse.conectado"]
        | undefined;

      setUltimoEvento(
        `sse.conectado · ${evento?.mensaje ?? "conexión establecida"}`
      );
    });

    return () => {
      off();
    };
  }, []);

  return (
    <main className="sse-demo">
      <section className="sse-demo-card">
        <p className="sse-demo-kicker">Integración SSE</p>
        <h1>Cliente de Server-Sent Events</h1>
        <p className="sse-demo-copy">
          Esta pantalla consume el stream global de sesión. Sirve como ejemplo
          de suscripción, limpieza y reconexión.
        </p>

        <div className="sse-demo-grid">
          <div>
            <span className="sse-demo-label">Evento recibido</span>
            <strong>{ultimoEvento}</strong>
          </div>
        </div>

        <div className="sse-demo-actions">
          <button
            type="button"
            onClick={() => {
              reconnectGlobalServerSentEventsConnection();
            }}
          >
            Reconectar
          </button>
          <button
            type="button"
            onClick={() => closeGlobalServerSentEventsConnection()}
          >
            Desconectar
          </button>
        </div>
      </section>
    </main>
  );
};
