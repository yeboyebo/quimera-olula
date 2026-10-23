import { QAviso } from "@olula/componentes/atomos/qaviso.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { MetaTabla, QTabla } from "@olula/componentes/atomos/qtabla.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useState } from "react";
import { CandidatoConciliacion, MovimientoBancario } from "../../diseño.js";
import {
    BloqueoConciliarMovimiento,
    esCasacionParcial,
    etiquetaTipoCasacion,
    urlRecibo,
} from "../../dominio.js";
import "./CandidatosConciliacion.css";

const SIN_ORDEN = ["", ""];

/**
 * Búsqueda de recibos para casar a mano (GET `.../candidatos`): por el importe
 * del movimiento (casación completa) o mayores (parcial). No son un
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

    const metaTablaCandidatos: MetaTabla<CandidatoConciliacion> = [
        {
            id: "codigo",
            cabecera: "Recibo",
            ancho: "20%",
            render: (c) => (
                <div className="recibo-candidato">
                    <span>{c.codigo}</span>
                    {c.facturaCodigo && <small>Factura {c.facturaCodigo}</small>}
                </div>
            ),
        },
        { id: "tercero", cabecera: "Tercero", ancho: "22%", render: (c) => c.tercero ?? "—" },
        { id: "tipoCasacion", cabecera: "Tipo", ancho: "12%", render: (c) => etiquetaTipoCasacion(c.tipoCasacion) },
        { id: "fechaVencimiento", cabecera: "Vence", tipo: "fecha", ancho: "12%" },
        {
            id: "diasDiferencia",
            cabecera: "Días",
            ancho: "6%",
            render: (c) => (c.diasDiferencia > 0 ? `+${c.diasDiferencia}` : `${c.diasDiferencia}`),
        },
        { id: "importe", cabecera: "Importe", tipo: "moneda", divisa: movimiento.divisa ?? "EUR", ancho: "10%" },
        {
            id: "reciboId",
            cabecera: "",
            ancho: "16%",
            render: (c) => (
                <div className="acciones-candidato">
                    <QBoton tamaño="pequeño" variante="borde" enlace={urlRecibo(c.tipoRecibo, c.reciboId)}>
                        Ver
                    </QBoton>
                    <QBoton
                        tamaño="pequeño"
                        onClick={() => publicar("candidato_solicitado", c)}
                        deshabilitado={bloqueo.bloqueado}
                    >
                        {esCasacionParcial(c.tipoCasacion) ? "Parcial" : "Casar"}
                    </QBoton>
                </div>
            ),
        },
    ];

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
                <QTabla<CandidatoConciliacion>
                    metaTabla={metaTablaCandidatos}
                    datos={candidatos}
                    cargando={false}
                    orden={SIN_ORDEN}
                />
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
