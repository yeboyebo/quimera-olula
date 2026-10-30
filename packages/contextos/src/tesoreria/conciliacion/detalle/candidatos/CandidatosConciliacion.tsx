import { QAviso } from "@olula/componentes/atomos/qaviso.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { formatearFechaDate, formatearMoneda } from "@olula/lib/dominio.js";
import { useState } from "react";
import { CandidatoConciliacion, MovimientoBancario } from "../../diseño.js";
import {
    BloqueoConciliarMovimiento,
    esConciliacionParcial,
    etiquetaTipoConciliacion,
    urlRecibo,
} from "../../dominio.js";
import "./CandidatosConciliacion.css";

/**
 * Búsqueda de recibos para conciliar a mano (GET `.../candidatos`): por el importe
 * del movimiento (conciliación completa) o mayores (parcial). No son un
 * sub-recurso persistido: se recalculan en cada búsqueda, así que no usan
 * ListaEntidades/ListaActivaEntidades, solo el array de detalle.ts.
 */
export const CandidatosConciliacion = ({
    movimiento,
    candidatos,
    texto,
    bloqueo,
    publicar,
}: {
    movimiento: MovimientoBancario;
    candidatos: CandidatoConciliacion[];
    texto: string;
    bloqueo: BloqueoConciliarMovimiento;
    publicar: EmitirEvento;
}) => {
    const [textoLocal, setTextoLocal] = useState(texto);

    const buscar = () => publicar("candidatos_buscados", textoLocal);

    return (
        <div className="CandidatosConciliacion">
            {bloqueo.bloqueado && <QAviso variante="advertencia">{bloqueo.motivo}</QAviso>}

            <h4>Buscar recibo</h4>
            <div id="buscador-candidatos">
                <QInput
                    label=""
                    placeholder="Buscar por recibo, factura, tercero o NIF"
                    nombre="textoCandidatos"
                    valor={textoLocal}
                    onChange={(valor) => setTextoLocal(valor)}
                    onEnterKeyUp={buscar}
                    condensado
                />
                <QBoton tamaño="pequeño" variante="borde" onClick={buscar}>
                    Buscar
                </QBoton>
            </div>

            {candidatos.length === 0 ? (
                <p className="sin-candidatos">No hay recibos pendientes por este importe o mayores.</p>
            ) : (
                <ul className="lista-candidatos">
                    {candidatos.map((c) => (
                        <TarjetaCandidato
                            key={c.id}
                            candidato={c}
                            divisa={movimiento.divisa ?? "EUR"}
                            bloqueado={bloqueo.bloqueado}
                            publicar={publicar}
                        />
                    ))}
                </ul>
            )}

            <div className="botones">
                <QBoton variante="borde" deshabilitado={bloqueo.bloqueado}
                    onClick={() => publicar("asiento_solicitado")}>
                    Asiento manual
                </QBoton>
                <QBoton variante="texto" onClick={() => publicar("ignorar_solicitado")}>
                    Ignorar movimiento
                </QBoton>
            </div>
        </div>
    );
};

/**
 * Tarjeta compacta de un recibo candidato: identificación y tercero a la
 * izquierda, importe y vencimiento (con los días de diferencia respecto al
 * movimiento) a la derecha, siempre visibles, y las acciones al final.
 */
const TarjetaCandidato = ({
    candidato: c,
    divisa,
    bloqueado,
    publicar,
}: {
    candidato: CandidatoConciliacion;
    divisa: string;
    bloqueado: boolean;
    publicar: EmitirEvento;
}) => (
    <li className="tarjeta-candidato">
        <div className="tarjeta-candidato-recibo">
            <span className="tarjeta-candidato-codigo">
                {c.codigo}
                {c.facturaCodigo && <small>Factura {c.facturaCodigo}</small>}
            </span>
            <small title={c.tercero ?? undefined}>
                {c.tercero ?? "—"} · {etiquetaTipoConciliacion(c.tipoConciliacion)}
            </small>
        </div>
        <div className="tarjeta-candidato-cifras">
            <strong>{formatearMoneda(c.importe, divisa)}</strong>
            <small>
                {formatearFechaDate(c.fechaVencimiento)} ({c.diasDiferencia > 0 ? "+" : ""}{c.diasDiferencia})
            </small>
        </div>
        <div className="tarjeta-candidato-acciones">
            <QBoton tamaño="pequeño" variante="borde" enlace={urlRecibo(c.tipoRecibo, c.reciboId)}>
                Ver
            </QBoton>
            <QBoton
                tamaño="pequeño"
                onClick={() => publicar("candidato_solicitado", c)}
                deshabilitado={bloqueado}
            >
                {esConciliacionParcial(c.tipoConciliacion) ? "Parcial" : "Conciliar"}
            </QBoton>
        </div>
    </li>
);
