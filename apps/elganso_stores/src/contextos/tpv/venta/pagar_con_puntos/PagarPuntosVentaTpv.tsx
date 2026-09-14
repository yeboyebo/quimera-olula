import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { formatearMoneda, formatearNumero, redondeaMoneda } from "@olula/lib/dominio.js";
import { useForm } from "@olula/lib/useForm.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useEffect, useMemo, useState } from "react";
import { VentaTpv } from "../diseño.ts";
import { getTopePuntos, postPago, TopePuntos } from "../infraestructura.ts";
import "./PagarPuntosVentaTpv.css";
import { metaNuevoPagoPuntos, nuevoPagoPuntosInicial } from "./pagar_con_puntos.ts";

export const PagarPuntosVentaTpv = ({
  publicar,
  venta,
}: {
  publicar: EmitirEvento;
  venta: VentaTpv;
}) => {
  const pendiente = redondeaMoneda(venta.pendiente, venta.divisa_id);

  // Tope real (tarjetas de empleado/dtoespecial) + saldo disponible,
  // calculados en el backend (mismo % que valida el pago al aceptar). Con
  // tope, igual que Eneboo: se autorellena con el máximo y se bloquea el
  // campo; sin tope (tarjeta normal) el importe se deja libre.
  const [tope, setTope] = useState<TopePuntos | null>(null);

  useEffect(() => {
    let cancelado = false;
    getTopePuntos(venta.id).then((valor) => {
      if (!cancelado) setTope(valor);
    });
    return () => {
      cancelado = true;
    };
  }, [venta.id]);

  const bloqueado = tope !== null && tope.importeMaximo !== null;

  const importePrefill = useMemo(() => {
    if (!bloqueado || tope?.importeMaximo == null) return pendiente;
    const candidatos = [tope.importeMaximo, pendiente];
    if (tope.saldoDisponible !== null) candidatos.push(tope.saldoDisponible);
    // Redondear hacia abajo (no redondeaMoneda, que redondea al más
    // cercano): el backend valida contra el máximo exacto sin redondear,
    // así que un 9,668 que redondeara a 9,67 quedaría por encima del tope
    // real y el pago se rechazaría pese a venir autorrellenado y bloqueado.
    return Math.floor(Math.min(...candidatos) * 100) / 100;
  }, [bloqueado, tope, pendiente]);

  const pagoInicial = useMemo(
    () => ({
      ...nuevoPagoPuntosInicial,
      importe: importePrefill,
      pendiente,
      saldoDisponible: tope?.saldoDisponible ?? null,
    }),
    [importePrefill, pendiente, tope]
  );

  const { modelo, uiProps, valido, set } = useModelo(metaNuevoPagoPuntos, pagoInicial);

  const pagar_ = useCallback(async () => {
    await postPago(venta.id, {
      importe: modelo.importe,
      formaPago: "PUNTOS",
    });
    publicar("pago_con_puntos_hecho");
  }, [modelo, publicar, venta.id]);

  const cancelar_ = useCallback(() => publicar("pago_cancelado"), [publicar]);

  const [pagar, cancelar] = useForm(pagar_, cancelar_);

  const setImporte = (v: number) => {
    set({ ...modelo, importe: v });
  };

  const limpiar = () => {
    setImporte(0);
  };

  return (
    <QModal
      abierto={true}
      nombre="pagar_puntos_venta_tpv"
      titulo="Pago con puntos"
      onCerrar={cancelar}
      anchoEstable
      pantallaCompletaMovil={false}
    >
      <div className="PagarPuntosVentaTpv">
        <quimera-formulario>
          <div id="pendiente">
            {`A pagar: ${formatearMoneda(pendiente, venta.divisa_id)}`}
          </div>

          {tope?.saldoDisponible != null && (
            <div id="saldo-disponible">
              {`Saldo disponible: ${formatearNumero(tope.saldoDisponible)}`}
            </div>
          )}

          <QInput label="Importe" {...uiProps("importe")} deshabilitado={bloqueado} />
        </quimera-formulario>

        <div className="botones maestro-botones ">
          <QBoton onClick={limpiar} deshabilitado={bloqueado}>
            Limpiar
          </QBoton>
          <QBoton onClick={pagar} deshabilitado={!valido}>
            Pagar
          </QBoton>
        </div>
      </div>
    </QModal>
  );
};
