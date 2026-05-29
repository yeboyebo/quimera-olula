import { retainGlobalServerSentEventsConnection } from "@olula/lib/api/server_sent_events_session.ts";
import { plugin } from "@olula/lib/dominio.ts";
import { useEffect } from "react";
import { estaAutentificado } from "./autenticacion";

export const SseSesionGlobal = () => {
  const autenticado = estaAutentificado();
  const pluginSseActivo = plugin("eventos_sse") === "activo";

  useEffect(() => {
    if (!autenticado || !pluginSseActivo) {
      return;
    }
    console.log("Conectando stream global de sesión...");
    const liberarConexion = retainGlobalServerSentEventsConnection();

    return () => {
      liberarConexion();
    };
  }, [autenticado, pluginSseActivo]);

  return null;
};
