import { ValeTpv } from "#/tpv/vale/diseño.ts";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { formatearMoneda, redondeaMoneda } from "@olula/lib/dominio.js";
import { useFocus } from "@olula/lib/useFocus.js";
import { useForm } from "@olula/lib/useForm.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useContext, useMemo, useState } from "react";
import { VentaTpv } from "../diseño.ts";
import { getVale, postPago } from "../infraestructura.ts";
import "./PagarValeVentaTpv.css";
import { metaNuevoPagoVale, nuevoPagoValeInicial } from "./pagar_con_vale.ts";

export const PagarValeVentaTpv = ({
  publicar,
  venta,
}: {
  publicar: EmitirEvento;
  venta: VentaTpv;
}) => {
  const pendiente = redondeaMoneda(venta.pendiente, venta.divisa_id);

  const pagoInicial = useMemo(
    () => ({
      ...nuevoPagoValeInicial,
      pendiente,
    }),
    [pendiente]
  );

  const { modelo, uiProps, valido, set, init } = useModelo(metaNuevoPagoVale, pagoInicial);

  const { intentar } = useContext(ContextoError);

  const [vale, setVale] = useState<ValeTpv | null>(null);
  const [codigoVale, setCodigoVale] = useState("");

  const buscarVale = async (codigo: string) => {
    if (!codigo) return;

    const vale = await intentar(() => getVale(codigo));
    setVale(vale);

    const importe = Math.min(vale.saldo_pendiente, pendiente);

    set({
      ...modelo,
      importe,
      vale_id: vale.id,
      saldoVale: vale.saldo_pendiente,
    });
  };

  const focus = useFocus();

  const limpiar = () => {
    init({ ...nuevoPagoValeInicial, pendiente });
    setVale(null);
    setCodigoVale("");
  };

  const pagar_ = useCallback(async () => {
    await postPago(venta.id, {
      importe: modelo.importe,
      formaPago: "VALE",
      idVale: modelo.vale_id,
    });
    publicar("pago_con_vale_hecho");
  }, [modelo, publicar, venta.id]);

  const cancelar_ = useCallback(() => publicar("pago_cancelado"), [publicar]);

  const [pagar, cancelar] = useForm(pagar_, cancelar_);

  return (
    <QModal
      abierto={true}
      nombre="pagar_vale_venta_tpv"
      titulo="Pago con vale"
      onCerrar={cancelar}
      anchoEstable
      pantallaCompletaMovil={false}
    >
      <div className="PagarValeVentaTpv">
        <quimera-formulario>
          <div id="pendiente">
            {`A pagar: ${formatearMoneda(pendiente, venta.divisa_id)}`}
          </div>

          {vale && (
            <div id="vale-codigo">{`Vale: ${vale.id}`}</div>
          )}

          {vale && (
            <div id="saldo-disponible">
              {`Saldo disponible: ${formatearMoneda(vale.saldo_pendiente, venta.divisa_id)}`}
            </div>
          )}

          {!vale && (
            <QInput
              label="Vale"
              nombre="vale_id"
              valor={codigoVale}
              onChange={(valor) => setCodigoVale(String(valor ?? ""))}
              ref={focus}
              autoFocus
              onEnterKeyUp={(codigo) => buscarVale(codigo)}
            />
          )}

          {vale && <QInput label="Importe" {...uiProps("importe")} />}
        </quimera-formulario>

        <div className="botones maestro-botones ">
          {!vale && (
            <QBoton onClick={() => buscarVale(codigoVale)} deshabilitado={!codigoVale}>
              Buscar
            </QBoton>
          )}
          {vale && <QBoton onClick={limpiar}>Limpiar</QBoton>}
          <QBoton onClick={pagar} deshabilitado={!valido}>
            Pagar
          </QBoton>
        </div>
      </div>
    </QModal>
  );
};
