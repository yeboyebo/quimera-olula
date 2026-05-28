import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { EstadoBorradorJornada } from "../diseño.ts";

export const BotoneraJornadaBorrador = ({
    estadoBorrador,
    onPausa,
    onStop,
    onPlay,
}: {
    estadoBorrador: EstadoBorradorJornada;
    onPausa: () => void;
    onStop: () => void;
    onPlay: () => void;
}) => {
    if (estadoBorrador === "ACTIVA") {
        return (
            <div className="botones maestro-botones">
                <QBoton onClick={onPausa}>Pausa</QBoton>
                <QBoton onClick={onStop}>Stop</QBoton>
            </div>
        );
    }
    if (estadoBorrador === "PAUSADA") {
        return (
            <div className="botones maestro-botones">
                <QBoton onClick={onPlay}>Play</QBoton>
            </div>
        );
    }
    return null;
};
