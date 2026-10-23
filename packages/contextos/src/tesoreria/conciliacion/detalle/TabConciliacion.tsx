import { QAviso } from "@olula/componentes/atomos/qaviso.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QEtiqueta } from "@olula/componentes/atomos/qetiqueta.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { FormModelo } from "@olula/lib/dominio.js";
import { CandidatoConciliacion, Casacion, MovimientoBancario } from "../diseño.js";
import {
    bloqueoConciliarMovimientoBancario,
    etiquetaEstadoMovimientoBancario,
    etiquetaOrigenConciliacion,
    etiquetaTipoCasacion,
    reciboAsociadoMovimientoBancario,
    urlReciboMovimientoBancario,
    varianteEstadoMovimientoBancario,
} from "../dominio.js";
import { CandidatosConciliacion } from "./candidatos/CandidatosConciliacion.js";
import { CasacionesMovimiento } from "./casaciones/CasacionesMovimiento.js";
import "./TabConciliacion.css";

interface TabConciliacionProps {
    form: FormModelo;
    movimiento: MovimientoBancario;
    casaciones: Casacion[];
    candidatos: CandidatoConciliacion[];
    candidatosTexto: string;
    publicar: EmitirEvento;
}

/**
 * Casaciones propuestas + búsqueda de recibos + asiento manual / Ignorar
 * cuando el movimiento está pendiente o con candidatos; casación aplicada +
 * Desconciliar cuando está casado; motivo + Reactivar cuando está ignorado.
 * Los modales (casar/, casar_asiento/, desconciliar/, ignorar/, reactivar/)
 * los monta DetalleConciliacion.tsx según `estado`.
 */
export const TabConciliacion = ({
    form, movimiento, casaciones, candidatos, candidatosTexto, publicar,
}: TabConciliacionProps) => {

    const { uiProps } = form;
    const bloqueo = bloqueoConciliarMovimientoBancario(movimiento);

    return (
        <div className="TabConciliacion">
            {movimiento.requiereRevision && (
                <QAviso variante="advertencia">
                    Este movimiento requiere revisión manual.
                </QAviso>
            )}

            <div id="estado-conciliacion">
                <QEtiqueta variante={varianteEstadoMovimientoBancario(movimiento.estado)}>
                    {etiquetaEstadoMovimientoBancario(movimiento.estado)}
                </QEtiqueta>
            </div>

            {movimiento.estado === "candidatos" && casaciones.length > 0 && (
                <CasacionesMovimiento
                    movimiento={movimiento}
                    casaciones={casaciones}
                    bloqueo={bloqueo}
                    publicar={publicar}
                />
            )}

            {(movimiento.estado === "pendiente" || movimiento.estado === "candidatos") && (
                <CandidatosConciliacion
                    movimiento={movimiento}
                    candidatos={candidatos}
                    texto={candidatosTexto}
                    bloqueo={bloqueo}
                    publicar={publicar}
                />
            )}

            {movimiento.estado === "conciliado" && (
                <div className="recibo-conciliado">
                    <div id="recibo-asociado">
                        <div>
                            <span className="etiqueta-recibo">
                                {movimiento.tipoCasacion ? etiquetaTipoCasacion(movimiento.tipoCasacion) : "Casación"}
                                {movimiento.probabilidad !== null && ` · ${movimiento.probabilidad} %`}
                            </span>
                            <span className="valor-recibo">{reciboAsociadoMovimientoBancario(movimiento)}</span>
                        </div>
                        {urlReciboMovimientoBancario(movimiento) && (
                            <QBoton tamaño="pequeño" variante="borde"
                                enlace={urlReciboMovimientoBancario(movimiento) ?? undefined}>
                                Ver recibo
                            </QBoton>
                        )}
                    </div>
                    <quimera-formulario>
                        <QInput label="Origen" nombre="origenConciliacion" soloLectura
                            valor={etiquetaOrigenConciliacion(movimiento.origenConciliacion)} />
                        <QInput label="Conciliado por" {...uiProps("conciliadoPor")} />
                        <QInput label="Conciliado el" {...uiProps("conciliadoEn")} />
                        {movimiento.justificacion && (
                            <QInput label="Justificación" {...uiProps("justificacion")} />
                        )}
                    </quimera-formulario>
                    <div className="botones">
                        <QBoton variante="borde" onClick={() => publicar("desconciliar_solicitado")}>
                            Desconciliar
                        </QBoton>
                    </div>
                </div>
            )}

            {movimiento.estado === "ignorado" && (
                <div className="movimiento-ignorado">
                    <quimera-formulario>
                        {/* El motivo indicado al ignorar se guarda en el mismo campo que la justificación de conciliar. */}
                        <QInput label="Motivo" {...uiProps("justificacion")} />
                    </quimera-formulario>
                    <div className="botones">
                        <QBoton variante="borde" onClick={() => publicar("reactivar_solicitado")}>Reactivar</QBoton>
                    </div>
                </div>
            )}
        </div>
    );
};
