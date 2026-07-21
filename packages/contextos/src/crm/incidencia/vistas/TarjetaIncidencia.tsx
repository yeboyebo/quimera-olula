import { descripcionEstadoIncidencia } from "#/crm/comun/componentes/EstadoIncidencia.tsx";
import { QAvatar } from "@olula/componentes/index.js";
import { Incidencia } from "../diseño.ts";
import "./TarjetaIncidencia.css";

export const TarjetaIncidencia = (incidencia: Incidencia) => (
  <div className={`tarjeta-incidencia estado-${incidencia.estado}`}>
    <div className="columna">
      <div className="tarjeta-icono">
        <QAvatar nombre={incidencia.descripcion} tamaño="sm" />
      </div>
    </div>
    <div className="columna">
      <div className="tarjeta-titulo">{incidencia.descripcion}</div>
      <div className="tarjeta-detalle">ID: {incidencia.id}</div>
      <div className="tarjeta-estado">
        {descripcionEstadoIncidencia(incidencia.estado)}
      </div>
    </div>
  </div>
);
