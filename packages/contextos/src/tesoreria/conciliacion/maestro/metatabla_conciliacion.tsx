import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QEtiqueta } from "@olula/componentes/atomos/qetiqueta.tsx";
import { QIcono } from "@olula/componentes/atomos/qicono.tsx";
import { MetaTabla } from "@olula/componentes/index.js";
import { formatearMoneda } from "@olula/lib/dominio.js";
import { MovimientoBancario } from "../diseño.js";
import {
    cuentaMovimientoBancario,
    esIngresoMovimientoBancario,
    etiquetaEstadoMovimientoBancario,
    urlReciboMovimientoBancario,
    varianteEstadoMovimientoBancario,
} from "../dominio.js";

/**
 * Los `id` son nombres de campo del API: al pulsar una cabecera se ordena por
 * ese campo, y el backend solo acepta los de MovimientoBancarioApi.
 *
 * Los renders van como funciones anónimas dentro del array (en vez de
 * componentes con nombre propio) para no disparar el aviso de
 * react-refresh/only-export-components en este fichero.
 */
export const metaTablaMovimientoBancario: MetaTabla<MovimientoBancario> = [
    { id: "fecha", cabecera: "Fecha", tipo: "fecha" },
    { id: "concepto", cabecera: "Concepto" },
    {
        id: "importe",
        cabecera: "Importe",
        render: (movimiento) => (
            <span className={esIngresoMovimientoBancario(movimiento) ? "importe-ingreso" : "importe-cargo"}>
                {formatearMoneda(movimiento.importe, movimiento.divisa ?? "EUR")}
            </span>
        ),
    },
    {
        id: "estado",
        cabecera: "Estado",
        render: (movimiento) => (
            <div className="celda-estado-movimiento-bancario">
                <QEtiqueta variante={varianteEstadoMovimientoBancario(movimiento.estado)}>
                    {etiquetaEstadoMovimientoBancario(movimiento.estado)}
                </QEtiqueta>
                {movimiento.requiereRevision && (
                    <QEtiqueta variante="advertencia">Revisar</QEtiqueta>
                )}
                {movimiento.pendiente && (
                    <QIcono
                        nombre="relojarena"
                        tamaño="xs"
                        color="var(--color-advertencia-oscuro)"
                    />
                )}
            </div>
        ),
    },
    {
        id: "codigo_recibo",
        cabecera: "Recibo",
        render: (movimiento) => {
            const url = urlReciboMovimientoBancario(movimiento);
            if (!url) return "—";

            return (
                <div className="celda-recibo-movimiento-bancario">
                    <span>{movimiento.nombreTercero ?? movimiento.codigoRecibo}</span>
                    {/* Sin stopPropagation el clic también seleccionaría la fila. */}
                    <QBoton tamaño="pequeño" variante="borde" enlace={url}
                        onClick={(evento) => evento.stopPropagation()}>
                        Ver recibo
                    </QBoton>
                </div>
            );
        },
    },
    { id: "contraparte", cabecera: "Contraparte", render: (m) => m.contraparte ?? "—" },
    { id: "nombre_cuenta", cabecera: "Cuenta", render: cuentaMovimientoBancario },
];
