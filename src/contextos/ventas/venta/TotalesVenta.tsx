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
        <span>
          {new Intl.NumberFormat("es-ES", {
            style: "currency",
            currency: divisa,
          }).format(neto)}
        </span>
      </div>
      <div className="totales-venta-item">
        <label>Total IVA:</label>
        <span>
          {new Intl.NumberFormat("es-ES", {
            style: "currency",
            currency: divisa,
          }).format(totalIva)}
        </span>
      </div>
      <div className="totales-venta-item">
        <label>Total:</label>
        <span>
          {new Intl.NumberFormat("es-ES", {
            style: "currency",
            currency: divisa,
          }).format(total)}
        </span>
      </div>
    </div>
  );
};
