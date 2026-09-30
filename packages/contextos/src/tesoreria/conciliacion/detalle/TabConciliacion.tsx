import { QAviso } from "@olula/componentes/atomos/qaviso.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QEtiqueta } from "@olula/componentes/atomos/qetiqueta.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { FormModelo } from "@olula/lib/dominio.js";
import { CandidatoConciliacion, MovimientoBancario } from "../diseño.js";
import {
    bloqueoConciliarMovimientoBancario,
    etiquetaEstadoMovimientoBancario,
    etiquetaOrigenConciliacion,
    reciboAsociadoMovimientoBancario,
    urlReciboMovimientoBancario,
    varianteEstadoMovimientoBancario,
} from "../dominio.js";
import { CandidatosConciliacion } from "./candidatos/CandidatosConciliacion.js";
import "./TabConciliacion.css";

interface TabConciliacionProps {
    form: FormModelo;
    movimiento: MovimientoBancario;
    candidatos: CandidatoConciliacion[];
    candidatosTexto: string;
    publicar: EmitirEvento;
}

/**
 * Fase 3 del plan de conciliación bancaria: candidatos + Conciliar / Ignorar
 * cuando el movimiento está pendiente/sugerido; recibo asociado + Desconciliar
 * cuando está conciliado; motivo + Reactivar cuando está ignorado. Los
 * modales (conciliar/, desconciliar/, ignorar/, reactivar/) los monta
 * DetalleConciliacion.tsx según `estado`.
 */
export const TabConciliacion = ({ form, movimiento, candidatos, candidatosTexto, publicar }: TabConciliacionProps) => {

    const { uiProps } = form;

    // El recibo sugerido sigue siendo candidato mientras no se pague: es el que se confirma.
    const sugerido = candidatos.find(
        (c) => c.tipoRecibo === movimiento.tipoRecibo && c.reciboId === movimiento.reciboId
    );

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

            {movimiento.estado === "sugerido" && (
                <div className="recibo-sugerido">
                    <div id="recibo-asociado">
                        <div>
                            <span className="etiqueta-recibo">Recibo sugerido</span>
                            <span className="valor-recibo">{reciboAsociadoMovimientoBancario(movimiento)}</span>
                            {movimiento.justificacion && (
                                <span className="justificacion-recibo">{movimiento.justificacion}</span>
                            )}
                        </div>
                        <div className="acciones-recibo">
                            {urlReciboMovimientoBancario(movimiento) && (
                                <QBoton tamaño="pequeño" variante="borde"
                                    enlace={urlReciboMovimientoBancario(movimiento) ?? undefined}>
                                    Ver recibo
                                </QBoton>
                            )}
                            {sugerido && (
                                <QBoton tamaño="pequeño"
                                    deshabilitado={bloqueoConciliarMovimientoBancario(movimiento).bloqueado}
                                    onClick={() => publicar("conciliacion_solicitada", sugerido)}>
                                    Confirmar
                                </QBoton>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {(movimiento.estado === "pendiente" || movimiento.estado === "sugerido") && (
                <CandidatosConciliacion
                    movimiento={movimiento}
                    candidatos={candidatos}
                    texto={candidatosTexto}
                    bloqueo={bloqueoConciliarMovimientoBancario(movimiento)}
                    publicar={publicar}
                />
            )}

            {movimiento.estado === "conciliado" && (
                <div className="recibo-conciliado">
                    <div id="recibo-asociado">
                        <div>
                            <span className="etiqueta-recibo">
                                {movimiento.tipoRecibo === "pago" ? "Recibo de pago" : "Recibo de cobro"}
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
