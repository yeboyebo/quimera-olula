import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { useModelo } from "@olula/lib/useModelo.ts";

import { ValeTpv } from "#/tpv/vale/diseño.ts";
import { getVale } from "#/tpv/vale/infraestructura.ts";
import { metaNuevoPagoVale } from "#/tpv/ventaTpv/diseño.ts";
import { nuevoPagoValeVacio } from "#/tpv/ventaTpv/dominio.ts";
import { QModal } from "@olula/componentes/index.js";
import { ContextoError } from "@olula/lib/contexto.js";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useContext, useState } from "react";
import { postPago } from "../../../infraestructura.ts";
import "./AltaPagoVale.css";

export const AltaPagoVale = ({
    activo = false,
    publicar,
    idVenta,
    pendiente,
}: {
    activo: boolean;
    publicar: EmitirEvento;
    idVenta: string;
    pendiente: number
}) => {

    const { modelo, uiProps, valido, dispatch, init } = useModelo(metaNuevoPagoVale, {
        ...nuevoPagoValeVacio,
    });
  
    const { intentar } = useContext(ContextoError);

    const [vale, setVale] = useState<ValeTpv | null>(null);

    const crear = async () => {

        const idPago = await intentar(() => postPago(
                idVenta, {
                importe: modelo.importe,
                formaPago: "VALE",
                idVale: modelo.vale_id
            }
        ));
        publicar("pago_creado", idPago);
    };

    const buscarVale = async (barcode: string) => {
        if (!barcode) {
            return;
        }
        const vale = await intentar(() => getVale(barcode))
        setVale(vale);
        dispatch({
            type: "set_campo",
            payload: { campo: "vale_id", valor: vale.id },
        });
        const saldoPendiente = vale.saldo_pendiente;
        const importe = Math.min(saldoPendiente, pendiente);
        console.log('importe', importe);
        dispatch({
            type: "set_campo",
            payload: { campo: "importe", valor: importe.toString() },
        });
    };

    const cancelar = () => {
        publicar("pago_cancelado");
    };

    const limpiar = () => {
        init(nuevoPagoValeVacio);
    }
    
    // useEffect(() => {
    //     if (activo && modelo !== nuevoPagoValeVacio) {
    //         limpiar();
    //     }
    // }, [activo, modelo, limpiar]);
    
    return (
        <QModal abierto={activo} nombre="mostrar" onCerrar={cancelar}>
        <div className="AltaPago">
            <h2>Nuevo pago</h2>
            <quimera-formulario>
            <QInput label="Importe" {...uiProps("importe")} />
            
            <QInput label='Vale' nombre='vale_id' onEnterKeyUp={
                (barcode)=>buscarVale(barcode)
                }>
            </QInput>
            </quimera-formulario>
            <div className="botones maestro-botones ">
            {`A Pagar: ${pendiente}€`}
                <br/>
            {
                vale
                    ? `Vale: ${vale.id}. Saldo inicial ${vale.saldo_inicial}€. Saldo pendiente ${vale.saldo_pendiente}€`
                    : 'No hay vale seleccionado'
            }
            <QBoton onClick={limpiar}>Limpiar</QBoton>
            </div>
            <div className="botones maestro-botones ">
            <QBoton onClick={crear} deshabilitado={!valido}>
                Pagar
            </QBoton>
            </div>
        </div>
        </QModal>
    );
};
