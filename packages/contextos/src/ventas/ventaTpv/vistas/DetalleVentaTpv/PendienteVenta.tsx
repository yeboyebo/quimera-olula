import { formatearMoneda } from "@olula/lib/dominio.ts";
import "./PendienteVenta.css";

interface PendienteVentaProps {
  total: number;
  pagado: number;
  divisa: string;
}

export const PendienteVenta = ({
  total,
  pagado,
  divisa,
}: PendienteVentaProps) => {
  return (
    <div className="pendientes-venta">
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
