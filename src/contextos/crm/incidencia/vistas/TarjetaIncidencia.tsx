import { QAvatar } from "../../../../componentes/atomos/qavatar";
import { Incidencia } from "../diseño.ts";
import "./TarjetaIncidencia.css";

export const TarjetaIncidencia = ({
  incidencia,
}: {
  incidencia: Incidencia;
}) => (
  <div className="tarjeta-incidencia">
    <div className="columna">
      <div className="tarjeta-icono">
        <QAvatar nombre={incidencia.descripcion} tamaño="sm" />
      </div>
    </div>
    <div className="columna">
      <div className="tarjeta-titulo">{incidencia.descripcion}</div>
      <div className="tarjeta-detalle">ID: {incidencia.id}</div>
      {/* <div className="tarjeta-detalle">
        Cliente: {incidencia.nombre_cliente}
      </div>
      <div className="tarjeta-detalle">Importe: {incidencia.importe}</div> */}
    </div>
  </div>
);
