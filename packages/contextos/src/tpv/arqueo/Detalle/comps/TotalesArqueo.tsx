import { formatearMoneda } from "@olula/lib/dominio.ts";
import { ArqueoTpv } from "../../diseño.ts";
import "./TotalesArqueo.css";

interface TotalesArqueoProps {
  arqueo: ArqueoTpv;
  // publicar: EmitirEvento,
}

export const TotalesArqueo = ({
  arqueo,
  // publicar,
}: TotalesArqueoProps) => {

  const efectivo = arqueo.pagosEfectivo;
  const tarjeta = arqueo.pagosTarjeta;
  const vales = arqueo.pagosVale;
  const divisa = 'EUR';

  return (
    <div className="totales-arqueo">

      <h3>Total Pagos</h3>
      
      <div className="totales-arqueo-item">
        <label>Efectivo:</label>
        <span>{formatearMoneda(efectivo, divisa)}</span>
      </div>

      <div className="totales-arqueo-item">
        <label>Tarjeta:</label>
        <span>{formatearMoneda(tarjeta, divisa)}</span>
      </div>

      <div className="totales-arqueo-item">
        <label>Vale:</label>
        <span>{formatearMoneda(vales, divisa)}</span>
      </div>
      
    </div>
  );
};
