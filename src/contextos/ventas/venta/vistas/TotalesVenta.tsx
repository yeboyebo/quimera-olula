import { formatearMoneda } from "../../../comun/dominio.ts";
import "./TotalesVenta.css";

interface TotalesVentaProps {
  neto: number;
  totalIva: number;
  total: number;
  divisa: string;
}

export const TotalesVenta = ({
  neto,
  totalIva,
  total,
  divisa,
}: TotalesVentaProps) => {
  return (
    <div className="totales-venta">
      <div className="totales-venta-item">
        <label>Neto:</label>
        <span>{formatearMoneda(neto, divisa)}</span>
      </div>
      <div className="totales-venta-item">
        <label>IVA:</label>
        <span>{formatearMoneda(totalIva, divisa)}</span>
      </div>
      <div className="totales-venta-item">
        <label>Total:</label>
        <span>{formatearMoneda(total, divisa)}</span>
      </div>
    </div>
  );
};
