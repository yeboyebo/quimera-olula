import { QAviso } from "@olula/componentes/atomos/qaviso.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QEtiqueta } from "@olula/componentes/atomos/qetiqueta.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { formatearFechaDate, formatearMoneda, FormModelo } from "@olula/lib/dominio.js";
import { Conciliacion, ItemConciliacion, MovimientoBancario, TipoConciliacion } from "../diseño.js";
import {
    etiquetaEstadoMovimientoBancario,
    etiquetaOrigenConciliacion,
    etiquetaTipoConciliacion,
    reciboAsociadoMovimientoBancario,
    urlReciboMovimientoBancario,
    varianteEstadoMovimientoBancario,
} from "../dominio.js";
import "./TabConciliacion.css";

const TIPOS_COBRO: TipoConciliacion[] = ["cobrar_recibo_venta", "cobro_parcial_venta"];

const etiquetaTercero = (tipo: TipoConciliacion): string =>
    TIPOS_COBRO.includes(tipo) ? "Cliente" : "Proveedor";

const ItemReciboConciliado = ({ item, divisa }: { item: ItemConciliacion; divisa: string }) => {
    const { recibo } = item;
    if (!recibo) return null;
    return (
        <div className="item-recibo-conciliado">
            <p className="tipo-item-recibo">{etiquetaTipoConciliacion(item.tipo)}</p>
            <quimera-formulario>
                <QInput nombre="ir-codigo" label="Código" soloLectura valor={recibo.codigo} />
                <QInput nombre="ir-tercero" label={etiquetaTercero(item.tipo)} soloLectura valor={recibo.tercero ?? "—"} />
                <QInput nombre="ir-importe" label="Importe" soloLectura valor={formatearMoneda(recibo.importe, divisa)} />
                <QInput nombre="ir-fecha-emision" label="Fecha emisión" soloLectura
                    valor={recibo.fechaEmision ? formatearFechaDate(recibo.fechaEmision) : "—"} />
                <QInput nombre="ir-fecha-cobro" label="Fecha de cobro" soloLectura
                    valor={recibo.fechaCobro ? formatearFechaDate(recibo.fechaCobro) : "—"} />
            </quimera-formulario>
        </div>
    );
};

const ItemAsientoManualConciliado = ({
    item,
    subcuentaBancoId,
}: {
    item: ItemConciliacion;
    subcuentaBancoId: string | null;
}) => {
    const subcuentaUsada = (item.params.codigo_subcuenta as string | undefined) ?? null;
    const subcuentaErronea =
        subcuentaBancoId !== null && subcuentaUsada !== null && subcuentaUsada !== subcuentaBancoId;
    return (
        <div className="item-recibo-conciliado">
            <p className="tipo-item-recibo">{etiquetaTipoConciliacion(item.tipo)}</p>
            <quimera-formulario>
                <QInput nombre="am-subcuenta" label="Subcuenta contable" soloLectura valor={subcuentaUsada ?? "—"} />
            </quimera-formulario>
            {subcuentaErronea && (
                <QAviso variante="error">
                    Subcuenta errónea: se usó <strong>{subcuentaUsada}</strong> en lugar de{" "}
                    <strong>{subcuentaBancoId}</strong>. Desconcilia y reconcilia con la subcuenta correcta.
                </QAviso>
            )}
        </div>
    );
};

interface SeccionEstadoConciliacionProps {
    form: FormModelo;
    movimiento: MovimientoBancario;
    conciliacionAplicada: Conciliacion | null;
    publicar: EmitirEvento;
}

/**
 * Estado del movimiento + información del elemento ERP conciliado.
 * Se muestra siempre por encima de las pestañas de búsqueda de candidatos.
 * Incluye la etiqueta de estado, la info del recibo/asiento cuando está
 * conciliado, el motivo cuando está ignorado, y los botones Desconciliar
 * y Reactivar.
 */
export const SeccionEstadoConciliacion = ({
    form, movimiento, conciliacionAplicada, publicar,
}: SeccionEstadoConciliacionProps) => {

    const { uiProps } = form;

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

            {movimiento.estado === "conciliado" && (
                <div className="recibo-conciliado">
                    <div id="recibo-asociado">
                        <div>
                            <span className="etiqueta-recibo">
                                {"Conciliación"}
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
                    {conciliacionAplicada && conciliacionAplicada.items.some(
                        i => i.recibo !== null || i.tipo === "asiento_manual" || i.tipo === "asiento_vinculado"
                    ) && (
                        <div className="items-recibo-conciliados">
                            {conciliacionAplicada.items.map((item, idx) =>
                                item.tipo === "asiento_manual" ? (
                                    <ItemAsientoManualConciliado
                                        key={idx}
                                        item={item}
                                        subcuentaBancoId={movimiento.subcuentaBancoId}
                                    />
                                ) : item.tipo === "asiento_vinculado" ? (
                                    <div key={idx} className="item-recibo-conciliado">
                                        <p className="tipo-item-recibo">{etiquetaTipoConciliacion(item.tipo)}</p>
                                        <quimera-formulario>
                                            <QInput nombre="av-idasiento" label="Asiento contable" soloLectura
                                                valor={String(item.params.idasiento ?? "—")} />
                                        </quimera-formulario>
                                    </div>
                                ) : (
                                    <ItemReciboConciliado
                                        key={idx}
                                        item={item}
                                        divisa={movimiento.divisa ?? "EUR"}
                                    />
                                )
                            )}
                        </div>
                    )}
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
