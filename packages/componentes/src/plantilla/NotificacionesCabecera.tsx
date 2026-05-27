import { puede } from "@olula/lib/dominio.ts";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getTotalComunicacionesNoLeidas } from "@olula/lib/api/notificaciones.ts";
import { QIcono } from "../atomos/qicono.tsx";
import { estaAutentificado } from "./autenticacion";
import "./NotificacionesCabecera.css";

const COMUNICACIONES_URL = "/comun/comunicacion";

export const NotificacionesCabecera = () => {
  const autenticado = estaAutentificado();
  const tienePermisoComunicacion = puede("comun.comunicacion");
  const [totalNoLeidas, setTotalNoLeidas] = useState(0);

  useEffect(() => {
    if (!autenticado || !tienePermisoComunicacion) return;

    getTotalComunicacionesNoLeidas()
      .then((total) => setTotalNoLeidas(total))
      .catch(() => setTotalNoLeidas(0));
  }, [autenticado, tienePermisoComunicacion]);

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
