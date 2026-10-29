import { EmitirEvento } from "@olula/lib/diseño.ts";
import { CandidatoConciliacion, Conciliacion, MovimientoBancario } from "../diseño.js";
import { bloqueoConciliarMovimientoBancario } from "../dominio.js";
import { CandidatosConciliacion } from "./candidatos/CandidatosConciliacion.js";
import { ConciliacionesMovimiento } from "./conciliaciones/ConciliacionesMovimiento.js";
import "./TabConciliacion.css";

interface TabConciliacionProps {
    movimiento: MovimientoBancario;
    conciliaciones: Conciliacion[];
    candidatos: CandidatoConciliacion[];
    candidatosTexto: string;
    publicar: EmitirEvento;
}

/**
 * Pestaña de búsqueda de candidatos para conciliar un movimiento pendiente
 * o con candidatos. Muestra las conciliaciones propuestas y el buscador de
 * recibos. Solo se monta cuando el movimiento puede conciliarse (estado
 * pendiente o candidatos).
 */
export const TabConciliacion = ({
    movimiento, conciliaciones, candidatos, candidatosTexto, publicar,
}: TabConciliacionProps) => {

    const bloqueo = bloqueoConciliarMovimientoBancario(movimiento);

    return (
        <div className="TabConciliacion">
            {movimiento.estado === "candidatos" && conciliaciones.length > 0 && (
                <ConciliacionesMovimiento
                    movimiento={movimiento}
                    conciliaciones={conciliaciones}
                    bloqueo={bloqueo}
                    publicar={publicar}
                />
            )}

            <CandidatosConciliacion
                movimiento={movimiento}
                candidatos={candidatos}
                texto={candidatosTexto}
                bloqueo={bloqueo}
                publicar={publicar}
            />
        </div>
    );
};
