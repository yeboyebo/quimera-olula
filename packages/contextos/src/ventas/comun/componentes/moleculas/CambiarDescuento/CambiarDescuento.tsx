import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { CambiarDescuento as CambiarDescuentoType } from "./diseño.ts";
import { cambiarDescuentoVacio, metaCambiarDescuento } from "./dominio.ts";

interface CambiarDescuentoProps {
    publicar: EmitirEvento;
}

export const CambiarDescuento = ({
    publicar,
}: CambiarDescuentoProps) => {
    const { modelo, uiProps, valido, init } = useModelo(
        metaCambiarDescuento,
        cambiarDescuentoVacio
    );

    const guardar = async () => {
        const cambio: CambiarDescuentoType = {
            dto_porcentual: modelo.dto_porcentual,
        };
        await publicar("descuento_aplicado", cambio);
        init(cambiarDescuentoVacio);
    };

    const cancelar = () => {
        publicar("descuento_cancelado");
        init(cambiarDescuentoVacio);
    };

    return (
        <QModal abierto={true} nombre="mostrar" onCerrar={cancelar}>
            <div className="CambiarDescuento">
                <h2>Descuento</h2>
                <quimera-formulario>
                    <QInput label="Descuento (%)" {...uiProps("dto_porcentual")} />
                </quimera-formulario>
                <div className="botones maestro-botones">
                    <QBoton onClick={guardar} deshabilitado={!valido}>
                        Aplicar
                    </QBoton>
                </div>
            </div>
        </QModal>
    );
};
