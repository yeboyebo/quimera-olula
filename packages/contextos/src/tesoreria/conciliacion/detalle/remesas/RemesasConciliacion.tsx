import { QAviso } from "@olula/componentes/atomos/qaviso.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { MetaTabla, QTabla } from "@olula/componentes/atomos/qtabla.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { formatearFechaDate } from "@olula/lib/dominio.ts";
import { MovimientoBancario, RemesaCandidata } from "../../diseño.js";
import {
    BloqueoConciliarMovimiento,
    esIngresoMovimientoBancario,
    esRemesaDeNominas,
    etiquetaTipoConciliacion,
    urlRemesa,
} from "../../dominio.js";
import "./RemesasConciliacion.css";

const SIN_ORDEN = ["", ""];

/**
 * Remesas que puede pagar el movimiento (GET `.../remesas`): de cobro si es un
 * ingreso, emitidas en su cuenta y con recibos pendientes por al menos su
 * importe; de pago si es un cargo, emitidas en su cuenta y por su importe exacto.
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
    const ingreso = esIngresoMovimientoBancario(movimiento);

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
        { id: "fechaCargo", cabecera: ingreso ? "Cargo" : "F. pago", tipo: "fecha", ancho: "12%" },
        {
            id: "diasDiferencia",
            cabecera: "Días",
            ancho: "6%",
            render: (r) => `${r.diasDiferencia}`,
        },
        {
            id: "recibos",
            cabecera: ingreso ? "Recibos pendientes" : "Recibos / nóminas",
            ancho: "14%",
            render: (r) => `${r.recibos.length}${esRemesaDeNominas(r) ? " nóminas" : ""}`,
        },
        { id: "importePendiente", cabecera: ingreso ? "Pendiente" : "Total", tipo: "moneda", divisa, ancho: "12%" },
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
                    <QBoton tamaño="pequeño" variante="borde" enlace={urlRemesa(r.id, r.tipoConciliacion)}>
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
                    {ingreso
                        ? "No hay remesas emitidas en esta cuenta con recibos pendientes por este importe o mayor."
                        : "No hay remesas de pago emitidas en esta cuenta por este importe."}
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
