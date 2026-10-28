import { QAviso } from "@olula/componentes/atomos/qaviso.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { MetaTabla, QTabla } from "@olula/componentes/atomos/qtabla.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { formatearFechaDate } from "@olula/lib/dominio.ts";
import { MovimientoBancario, RemesaCandidata } from "../../diseño.js";
import { BloqueoConciliarMovimiento, etiquetaTipoConciliacion, urlRemesa } from "../../dominio.js";
import "./RemesasConciliacion.css";

const SIN_ORDEN = ["", ""];

/**
 * Remesas de cobro que puede pagar un ingreso (GET `.../remesas`): emitidas en
 * la cuenta del movimiento y con recibos pendientes por al menos su importe.
 * Como los candidatos, se recalculan al cargar el movimiento y no se paginan.
 * "Conciliar" abre el modal donde se confirman los recibos que se pagan.
 */
export const RemesasConciliacion = ({
    movimiento,
    remesas,
    bloqueo,
    publicar,
}: {
    movimiento: MovimientoBancario;
    remesas: RemesaCandidata[];
    bloqueo: BloqueoConciliarMovimiento;
    publicar: EmitirEvento;
}) => {
    const divisa = movimiento.divisa ?? "EUR";

    const metaTablaRemesas: MetaTabla<RemesaCandidata> = [
        {
            id: "id",
            cabecera: "Remesa",
            ancho: "14%",
            render: (r) => (
                <div className="remesa-candidata">
                    <span>{r.id}</span>
                    <small>{formatearFechaDate(r.fecha)}</small>
                </div>
            ),
        },
        { id: "fechaCargo", cabecera: "Cargo", tipo: "fecha", ancho: "12%" },
        {
            id: "diasDiferencia",
            cabecera: "Días",
            ancho: "6%",
            render: (r) => `${r.diasDiferencia}`,
        },
        {
            id: "recibos",
            cabecera: "Recibos pendientes",
            ancho: "14%",
            render: (r) => `${r.recibos.length}`,
        },
        { id: "importePendiente", cabecera: "Pendiente", tipo: "moneda", divisa, ancho: "12%" },
        {
            id: "tipoConciliacion",
            cabecera: "Tipo",
            ancho: "20%",
            render: (r) => (
                <div className="remesa-candidata">
                    <span>{etiquetaTipoConciliacion(r.tipoConciliacion)}</span>
                    {r.tipoConciliacion === "cobro_parcial_remesa" && (
                        <small>
                            {r.reciboIdsPropuestos.length === 0
                                ? "Sin combinación que cuadre"
                                : `${r.reciboIdsPropuestos.length} recibos propuestos`
                                + (r.propuestaAmbigua ? " (hay otras)" : "")}
                        </small>
                    )}
                </div>
            ),
        },
        {
            id: "acciones",
            cabecera: "",
            ancho: "22%",
            render: (r) => (
                <div className="acciones-remesa">
                    <QBoton tamaño="pequeño" variante="borde" enlace={urlRemesa(r.id)}>
                        Ver
                    </QBoton>
                    <QBoton
                        tamaño="pequeño"
                        onClick={() => publicar("remesa_solicitada", r)}
                        deshabilitado={bloqueo.bloqueado}
                    >
                        {r.tipoConciliacion === "cobro_parcial_remesa" ? "Parcial" : "Conciliar"}
                    </QBoton>
                </div>
            ),
        },
    ];

    return (
        <div className="RemesasConciliacion">
            {bloqueo.bloqueado && <QAviso variante="advertencia">{bloqueo.motivo}</QAviso>}

            <h4>Remesas por conciliar</h4>
            {remesas.length === 0 ? (
                <p className="sin-remesas">
                    No hay remesas emitidas en esta cuenta con recibos pendientes por este importe o mayor.
                </p>
            ) : (
                <QTabla<RemesaCandidata>
                    metaTabla={metaTablaRemesas}
                    datos={remesas}
                    cargando={false}
                    orden={SIN_ORDEN}
                />
            )}
        </div>
    );
};
