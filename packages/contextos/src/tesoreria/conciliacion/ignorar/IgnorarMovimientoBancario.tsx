import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QTextArea } from "@olula/componentes/atomos/qtextarea.tsx";
import { QModal } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useForm } from "@olula/lib/useForm.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { MovimientoBancario } from "../diseño.js";
import { metaMotivoIgnorarMovimiento, motivoIgnorarVacio } from "./dominio.js";

/**
 * El motivo (comisión, traspaso...) es opcional. La llamada a la API
 * (PATCH `.../ignorar`) vive en detalle/detalle.ts (onIgnorado), a la que se
 * le pasa el motivo como payload del evento de confirmación.
 */
export const IgnorarMovimientoBancario = ({
    movimiento,
    publicar,
}: {
    movimiento: MovimientoBancario;
    publicar: EmitirEvento;
}) => {
    const { modelo, uiProps } = useModelo(metaMotivoIgnorarMovimiento, motivoIgnorarVacio);

    const ignorar_ = async () => publicar("ignorar_confirmado", modelo.motivo);
    const cancelar_ = () => publicar("ignorar_cancelado");

    const [ignorar, cancelar] = useForm(ignorar_, cancelar_);

    return (
        <QModal abierto={true} nombre="ignorarMovimientoBancario" titulo="Ignorar movimiento" onCerrar={cancelar}>
            <p>
                {`"${movimiento.concepto}" no liquidará ningún recibo (comisión, traspaso...). `}
                Puedes indicar opcionalmente el motivo.
            </p>
            <quimera-formulario>
                <QTextArea label="Motivo" {...uiProps("motivo")} />
            </quimera-formulario>
            <div className="botones maestro-botones">
                <QBoton onClick={ignorar}>Ignorar</QBoton>
            </div>
        </QModal>
    );
};
