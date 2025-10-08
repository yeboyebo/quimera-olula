import { QAvatar } from "../../../../componentes/atomos/qavatar";
import { OportunidadVenta } from "../diseño.ts";
import "./TarjetaOportunidadVenta.css";

export const TarjetaOportunidadVenta = ({
  oportunidad,
}: {
  oportunidad: OportunidadVenta;
}) => (
  <div className="tarjeta-oportunidad">
    <div className="columna">
      <div className="tarjeta-icono">
        <QAvatar nombre={oportunidad.descripcion} tamaño="lg" />
      </div>
    </div>
    <div className="columna">
      <div className="tarjeta-titulo">{oportunidad.descripcion}</div>
      <div className="tarjeta-detalle">ID: {oportunidad.id}</div>
      <div className="tarjeta-detalle">
        Cliente: {oportunidad.nombre_cliente}
      </div>
      <div className="tarjeta-detalle">Importe: {oportunidad.importe}</div>
    </div>
  </div>
);
