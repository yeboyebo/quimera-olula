import { QAviso } from "@olula/componentes/atomos/qaviso.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { MetaTabla, QTabla } from "@olula/componentes/atomos/qtabla.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useState } from "react";
import { CandidatoConciliacion, MovimientoBancario } from "../../diseño.js";
import { BloqueoConciliarMovimiento, urlRecibo } from "../../dominio.js";
import "./CandidatosConciliacion.css";

const SIN_ORDEN = ["", ""];

/**
 * Sugerencias de recibo para liquidar el movimiento (GET `.../candidatos`).
 * No son un sub-recurso persistido: se recalculan en cada búsqueda, así que
 * no usan ListaEntidades/ListaActivaEntidades, solo el array de detalle.ts.
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
            ancho: "24%",
            render: (c) => (
                <div className="recibo-candidato">
                    <span>{c.codigo}</span>
                    {c.facturaCodigo && <small>Factura {c.facturaCodigo}</small>}
                </div>
            ),
        },
        { id: "tercero", cabecera: "Tercero", ancho: "28%", render: (c) => c.tercero ?? "—" },
        { id: "fechaVencimiento", cabecera: "Vence", tipo: "fecha", ancho: "12%" },
        {
            id: "diasDiferencia",
            cabecera: "Días",
            ancho: "7%",
            render: (c) => (c.diasDiferencia > 0 ? `+${c.diasDiferencia}` : `${c.diasDiferencia}`),
        },
        { id: "importe", cabecera: "Importe", tipo: "moneda", divisa: movimiento.divisa ?? "EUR", ancho: "11%" },
        {
            id: "reciboId",
            cabecera: "",
            ancho: "18%",
            render: (c) => (
                <div className="acciones-candidato">
                    <QBoton tamaño="pequeño" variante="borde" enlace={urlRecibo(c.tipoRecibo, c.reciboId)}>
                        Ver
                    </QBoton>
                    <QBoton
                        tamaño="pequeño"
                        onClick={() => publicar("conciliacion_solicitada", c)}
                        deshabilitado={bloqueo.bloqueado}
                    >
                        Conciliar
                    </QBoton>
                </div>
            ),
        },
    ];

    return (
        <div className="CandidatosConciliacion">
            {bloqueo.bloqueado && <QAviso variante="advertencia">{bloqueo.motivo}</QAviso>}

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
                <p className="sin-candidatos">No hay recibos pendientes por este importe.</p>
            ) : (
                <QTabla<CandidatoConciliacion>
                    metaTabla={metaTablaCandidatos}
                    datos={candidatos}
                    cargando={false}
                    orden={SIN_ORDEN}
                />
            )}

            <div className="botones">
                <QBoton variante="texto" onClick={() => publicar("ignorar_solicitado")}>
                    Ignorar movimiento
                </QBoton>
            </div>
        </div>
    );
};
