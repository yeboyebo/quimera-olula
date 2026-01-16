import { ValeTpv } from "#/tpv/vale/diseño.ts";
import { getVale } from "#/tpv/vale/infraestructura.ts";
import { VentaTpv } from "#/tpv/venta/diseño";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { ContextoError } from "@olula/lib/contexto.js";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { redondeaMoneda } from "@olula/lib/dominio.js";
import { useForm } from "@olula/lib/useForm.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useContext, useState } from "react";
import { postPago } from "../infraestructura.ts";
import "./PagoValeVentaTpv.css";
import { metaNuevoPagoVale, nuevoPagoValeVacio } from "./pagar_con_vale.ts";

export const PagoValeVentaTpv = ({
    publicar,
    venta,
}: {
    publicar: EmitirEvento;
    venta: VentaTpv;
}) => {
    
    const aPagar = redondeaMoneda(venta.total - venta.pagado, venta.divisa_id)

    const { modelo, uiProps, valido, set, init } = useModelo(metaNuevoPagoVale, {
        ...nuevoPagoValeVacio,
        aPagar,
    });

    const { intentar } = useContext(ContextoError);

    const pagar_ = useCallback(
        async () => {
            const idPago = await postPago(
                venta.id,
                {
                    importe: modelo.importe,
                    formaPago: "VALE",
                    idVale: modelo.vale_id
                }
            );
            publicar("pago_con_vale_hecho", idPago);
        },
        [modelo, publicar, venta.id]
    );

    const cancelar_ = useCallback(
        () => publicar("pago_cancelado"),
        [publicar]
    );
    const [pagar, cancelar] = useForm(pagar_, cancelar_);

    const [vale, setVale] = useState<ValeTpv | null>(null);


    const buscarVale = async (barcode: string) => {

        if (!barcode) {
            return;
        }

        const vale = await intentar(() => getVale(barcode))
        setVale(vale);

        const saldoPendiente = vale.saldo_pendiente;
        const importe = Math.min(saldoPendiente, aPagar);
        
        set({
            ...modelo,
            importe: importe,
            vale_id: vale.id,
            saldoVale: vale.saldo_pendiente
        })
    };



    const limpiar = () => {
        init(nuevoPagoValeVacio);
        setVale(null);
    }
    
    return (
        <QModal abierto={true} nombre="mostrar" onCerrar={cancelar}>
        <div className="AltaPago">
            <h2>Nuevo pago</h2>
            <quimera-formulario>
            <QInput label="Importe" {...uiProps("importe")} />
            
            <QInput label='Vale' nombre='vale_id' 
                onEnterKeyUp={(barcode)=>buscarVale(barcode)}
            />
            </quimera-formulario>
            <div className="botones maestro-botones ">
            {`A Pagar: ${aPagar}€`}
                <br/>
            {
                vale
                    ? `Vale: ${vale.id}. Saldo inicial ${vale.saldo_inicial}€. Saldo disponible ${vale.saldo_pendiente}€`
                    : 'No hay vale seleccionado'
            }
            <QBoton onClick={limpiar}>Limpiar</QBoton>
            </div>
            <div className="botones maestro-botones ">
            <QBoton onClick={pagar}
                deshabilitado={!valido}>
                Pagar
            </QBoton>
            </div>
        </div>
        </QModal>
    );
};
