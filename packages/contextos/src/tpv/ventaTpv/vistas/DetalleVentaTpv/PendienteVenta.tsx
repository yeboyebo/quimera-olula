import { QBoton } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { formatearMoneda } from "@olula/lib/dominio.ts";
import { HookModelo } from "@olula/lib/useModelo.js";
import { VentaTpv } from "../../diseño.ts";
import "./PendienteVenta.css";

interface PendienteVentaProps {
  // total: number;
  // pagado: number;
  // divisa: string;
  venta: HookModelo<VentaTpv>;
  publicar: EmitirEvento,
}

export const PendienteVenta = ({
  venta,
  publicar,
}: PendienteVentaProps) => {

  const total = venta.modelo.total;
  const pagado = venta.modelo.pagado;
  const divisa = venta.modelo.divisa_id || "EUR";

  const pendiente = total - pagado;

  return (
    <div className="pendientes-venta">
      
      <div className="botones maestro-botones ">

        {pendiente < 0 && (
          <QBoton onClick={() => publicar("emision_de_vale_solicitada", venta.modelo)}>
            Emitir Vale
          </QBoton>
        )}

        {pendiente > 0 && (
          <>
            <QBoton onClick={() => publicar("pago_efectivo_solicitado")}>
              P. Efectivo 
            </QBoton>

            <QBoton onClick={() => publicar("pago_tarjeta_solicitado")}>
              P. Tarjeta 
            </QBoton>

            <QBoton onClick={() => publicar("pago_vale_solicitado")}>
              P. Vale 
            </QBoton>
          </>
        )}

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
