import { formatearMoneda } from "@olula/lib/dominio.ts";
import { ArqueoTpv } from "../../diseño.ts";
import "./ResumenRecuento.css";

interface ResumenRecuentoProps {
  arqueo: ArqueoTpv;
  // publicar: EmitirEvento,
}

export const ResumenRecuento = ({
  arqueo,
  // publicar,
}: ResumenRecuentoProps) => {

  const efectivo = arqueo.recuentoEfectivo;
  const tarjeta = arqueo.recuentoTarjeta;
  const vales = arqueo.recuentoVales;
  const divisa = 'EUR';

  return (
    <div className="resumen-recuento">
      <h3>Resumen Recuento</h3><br></br>
      
      <div className="resumen-recuento-item">
        <label>Efectivo:</label>
        <span>{formatearMoneda(efectivo, divisa)}</span>
      </div>

      <div className="resumen-recuento-item">
        <label>Tarjeta:</label>
        <span>{formatearMoneda(tarjeta, divisa)}</span>
      </div>

      <div className="resumen-recuento-item">
        <label>Vale:</label>
        <span>{formatearMoneda(vales, divisa)}</span>
      </div>
      
    </div>
  );
};
