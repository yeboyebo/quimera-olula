import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QEtiqueta } from "@olula/componentes/atomos/qetiqueta.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { formatearFechaDate, formatearMoneda } from "@olula/lib/dominio.ts";
import { Casacion, MovimientoBancario } from "../../diseño.js";
import {
    BloqueoConciliarMovimiento,
    etiquetaOrigenConciliacion,
    etiquetaTipoCasacion,
    urlReciboCasacion,
    varianteProbabilidad,
} from "../../dominio.js";
import "./CasacionesMovimiento.css";

/**
 * Casaciones candidatas propuestas por las reglas o la IA (GET `.../casaciones`),
 * de más a menos probable. "Casar" abre el modal de confirmación (o el de
 * datos, si el tipo los pide) a través de `casacion_solicitada`.
 */
export const CasacionesMovimiento = ({
    movimiento,
    casaciones,
    bloqueo,
    publicar,
}: {
    movimiento: MovimientoBancario;
    casaciones: Casacion[];
    bloqueo: BloqueoConciliarMovimiento;
    publicar: EmitirEvento;
}) => {
    const divisa = movimiento.divisa ?? "EUR";

    return (
        <div className="CasacionesMovimiento">
            <h4>Casaciones propuestas</h4>
            <ul>
                {casaciones.map((casacion) => {
                    const url = urlReciboCasacion(casacion);
                    return (
                        <li key={casacion.id}>
                            <QEtiqueta variante={varianteProbabilidad(casacion.probabilidad)}>
                                {`${casacion.probabilidad} %`}
                            </QEtiqueta>
                            <div className="descripcion-casacion">
                                <span className="tipo-casacion">
                                    {etiquetaTipoCasacion(casacion.tipo)}
                                    {casacion.recibo && ` · ${casacion.recibo.codigo}`}
                                </span>
                                {casacion.cuota && (
                                    <span className="recibo-casacion">
                                        {`${casacion.cuota.contrato ?? "Préstamo"} · ${formatearFechaDate(casacion.cuota.fecha)} · ${formatearMoneda(casacion.cuota.capital, divisa)} de capital y ${formatearMoneda(casacion.cuota.intereses, divisa)} de intereses`}
                                    </span>
                                )}
                                {casacion.recibo && (
                                    <span className="recibo-casacion">
                                        {`${casacion.recibo.tercero ?? "Sin tercero"} · ${formatearMoneda(casacion.recibo.importe, divisa)} · vence ${formatearFechaDate(casacion.recibo.fechaVencimiento)}`}
                                    </span>
                                )}
                                {casacion.justificacion && (
                                    <span className="justificacion-casacion">
                                        {`${etiquetaOrigenConciliacion(casacion.origen)}: ${casacion.justificacion}`}
                                    </span>
                                )}
                            </div>
                            <div className="acciones-casacion">
                                {url && (
                                    <QBoton tamaño="pequeño" variante="borde" enlace={url}>
                                        Ver recibo
                                    </QBoton>
                                )}
                                <QBoton
                                    tamaño="pequeño"
                                    deshabilitado={bloqueo.bloqueado}
                                    onClick={() => publicar("casacion_solicitada", casacion)}
                                >
                                    Casar
                                </QBoton>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
