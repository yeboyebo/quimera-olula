import { metaNuevoPagoEfectivo, VentaTpv } from "#/tpv/ventaTpv/diseño.ts";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { redondeaMoneda } from "@olula/lib/dominio.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useEffect, useState } from "react";
import { nuevoPagoEfectivoVacio } from "../../../dominio.ts";
import "./AltaPagoTarjeta.css";

export const AltaPagoTarjeta = ({
  publicar,
  venta,
}: {
  publicar: EmitirEvento;
  venta: VentaTpv;
}) => {

    const { modelo, uiProps, valido, dispatch } = useModelo(
        metaNuevoPagoEfectivo, nuevoPagoEfectivoVacio
    );
    const [pagando, setPagando] = useState(false);

    const pendiente = redondeaMoneda(venta.total - venta.pagado, venta.divisa_id)

    const pagar = () => {
        setPagando(true);
        publicar("pago_con_tarjeta_listo", modelo);
    };

    const cancelar = useCallback(
        () => {
            if (!pagando) publicar("pago_cancelado");
        },
        [pagando, publicar]
    );

    const setImporte = (v: number) => {
        dispatch({
            type: "set_campo",
            payload: { campo: "importe", valor: v.toString() },
        });
    }

    const limpiar = () => {
        setImporte(0);  
    }

    useEffect(() => {
        dispatch({
            type: "set_campo",
            payload: { campo: "importe", valor: pendiente.toString() },
        });
    }, [])

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
