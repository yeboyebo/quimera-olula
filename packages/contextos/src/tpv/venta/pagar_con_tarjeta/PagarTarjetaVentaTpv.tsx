import { VentaTpv } from "#/tpv/venta/diseño.ts";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { redondeaMoneda } from "@olula/lib/dominio.js";
import { useForm } from "@olula/lib/useForm.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback } from "react";
import { postPago } from "../infraestructura.ts";
import "./PagarTarjetaVentaTpv.css";
import { metaNuevoPagoTarjeta, nuevoPagoTarjetaVacio } from "./pagar_con_tarjeta.ts";

export const PagarTarjetaVentaTpv = ({
  publicar,
  venta,
}: {
  publicar: EmitirEvento;
  venta: VentaTpv;
}) => {

    const pendiente = redondeaMoneda(venta.total - venta.pagado, venta.divisa_id)
    
    const { modelo, uiProps, valido, set } = useModelo(
        metaNuevoPagoTarjeta, {
            ...nuevoPagoTarjetaVacio,
            importe: pendiente
        }
    );

    const pagar_ = useCallback(
        async () => {
            const idPago = await postPago(
                venta.id,
                {
                    importe: modelo.importe,
                    formaPago: "TARJETA",
                }
            );
            publicar("pago_con_tarjeta_hecho", idPago);
        },
        [modelo, publicar, venta.id]
    );

    const cancelar_ = useCallback(
        () => publicar("pago_cancelado"),
        [publicar]
    );

    const [pagar, cancelar] = useForm(pagar_, cancelar_);

    const setImporte = (v: number) => {
        set({
            ...modelo,
            importe: v,
        });
    }

    const limpiar = () => {
        setImporte(0);  
    }

    return (
        <QModal abierto={true} nombre="mostrar" onCerrar={cancelar}>

            <div className="AltaPago">

                <h2>Pago con tarjeta</h2>

                <quimera-formulario>
                    <QInput label="Importe" {...uiProps("importe")} />
                </quimera-formulario>

                <div className="botones maestro-botones ">

                    {`A Pagar: ${pendiente}€`}

                    <QBoton onClick={limpiar}>Limpiar</QBoton>

                </div>

                <div className="botones maestro-botones ">
                    <QBoton onClick={pagar} deshabilitado={!valido}>
                        Pagar
                    </QBoton>
                </div>

            </div>

        </QModal>
    );
};
