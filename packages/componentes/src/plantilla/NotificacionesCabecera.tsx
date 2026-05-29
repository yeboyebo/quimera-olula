import { getTotalComunicacionesNoLeidas } from "@olula/lib/api/notificaciones.ts";
import { onGlobalServerSentEvent } from "@olula/lib/api/server_sent_events_session.ts";
import { plugin, puede } from "@olula/lib/dominio.ts";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { QIcono } from "../atomos/qicono.tsx";
import { estaAutentificado } from "./autenticacion";
import "./NotificacionesCabecera.css";

const COMUNICACIONES_URL = "/comun/comunicacion";

export const NotificacionesCabecera = () => {
  const autenticado = estaAutentificado();
  const tienePermisoComunicacion = puede("comun.comunicacion");
  const pluginSseActivo = plugin("eventos_sse") === "activo";
  const [totalNoLeidas, setTotalNoLeidas] = useState(0);

  useEffect(() => {
    if (!autenticado || !tienePermisoComunicacion) {
      setTotalNoLeidas(0);
      return;
    }

    const refrescarTotalNoLeidas = () => {
      getTotalComunicacionesNoLeidas()
        .then((total) => setTotalNoLeidas(total))
        .catch(() => setTotalNoLeidas(0));
    };

    refrescarTotalNoLeidas();

    if (!pluginSseActivo) {
      return;
    }

    return onGlobalServerSentEvent("comun.comunicacion.creada", (event) => {
      try {
        const evento = JSON.parse(String(event.data ?? "")) as {
          comunicacion_id?: string | number;
          usuario_destino_id?: string | number;
          timestamp?: string | number;
        };

        const comunicacionId = evento.comunicacion_id;
        const usuarioDestinoId = evento.usuario_destino_id;
        const timestamp = evento.timestamp;

        if (
          comunicacionId == null ||
          usuarioDestinoId == null ||
          timestamp == null
        ) {
          return;
        }

        refrescarTotalNoLeidas();
      } catch {
        // Ignora payloads inválidos sin romper la vista.
      }
    });
  }, [autenticado, tienePermisoComunicacion, pluginSseActivo]);

  if (!autenticado || !tienePermisoComunicacion) return null;

  return (
    <Link
      to={COMUNICACIONES_URL}
      className="accion-cabecera-notificaciones"
      aria-label={`Ir a comunicaciones. ${totalNoLeidas} notificaciones sin leer.`}
      title="Notificaciones"
    >
      <QIcono nombre="bell" tamaño="sm" />
      <span className="accion-cabecera-notificaciones-badge">
        {totalNoLeidas}
      </span>
    </Link>
  );
};
