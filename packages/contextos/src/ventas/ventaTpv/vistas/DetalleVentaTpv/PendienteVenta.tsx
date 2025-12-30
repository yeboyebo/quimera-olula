import { QBoton } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { formatearMoneda } from "@olula/lib/dominio.ts";
import "./PendienteVenta.css";

interface PendienteVentaProps {
  total: number;
  pagado: number;
  divisa: string;
  publicar: EmitirEvento,
}

export const PendienteVenta = ({
  total,
  pagado,
  divisa,
  publicar,
}: PendienteVentaProps) => {
  return (
    <div className="pendientes-venta">
      <div className="botones maestro-botones ">
      <QBoton onClick={() => publicar("devolucion_solicitada")}>
        Devolución
      </QBoton>
      <QBoton onClick={() => publicar("pago_efectivo_solicitado")}>
        P. Efectivo 
      </QBoton>
      <QBoton onClick={() => publicar("pago_tarjeta_solicitado")}>
        P. Tarjeta 
      </QBoton>
      </div>
      <div className="pendientes-venta-item">
        <label>Total:</label>
        <span>{formatearMoneda(total, divisa)}</span>
      </div>
      <div className="pendientes-venta-item">
        <label>Pagado:</label>
        <span>{formatearMoneda(pagado, divisa)}</span>
      </div>
      <div className="pendientes-venta-item">
        <label>Pendiente:</label>
        <span>{formatearMoneda(total - pagado, divisa)}</span>
      </div>
    </div>
  );
};
