import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { formatearFechaDate, formatearMoneda } from "@olula/lib/dominio.js";
import { ReactNode, useEffect, useState } from "react";
import { MovimientoBancario, PartidaHuerfana } from "../diseño.js";
import { getPartidasHuerfanas } from "../infraestructura.js";
import "./TabPartidas.css";

type TipoColumna = "texto" | "numero" | "moneda" | "fecha";

type ColumnaPartida = {
    id: string;
    cabecera: string;
    tipo?: TipoColumna;
    render: (p: PartidaHuerfana) => ReactNode;
};

const importeCoincide = (partida: PartidaHuerfana, movimiento: MovimientoBancario): boolean =>
    Math.abs(partida.importe - movimiento.importe) < 0.01;

const getColumnas = (publicar: EmitirEvento, movimiento: MovimientoBancario): ColumnaPartida[] => [
    {
        id: "fecha",
        cabecera: "Fecha",
        tipo: "fecha",
        render: (p) => formatearFechaDate(p.fecha),
    },
    {
        id: "asiento",
        cabecera: "Asiento",
        tipo: "numero",
        render: (p) => p.numeroAsiento ?? `#${p.idasiento}`,
    },
    {
        id: "descripcion",
        cabecera: "Descripción",
        render: (p) => p.descripcion ?? "—",
    },
    {
        id: "importe",
        cabecera: "Importe",
        tipo: "moneda",
        render: (p) => formatearMoneda(p.importe, movimiento.divisa ?? "EUR"),
    },
    {
        id: "accion",
        cabecera: "",
        render: (p) => (
            <QBoton
                tamaño="pequeño"
                variante="borde"
                deshabilitado={!importeCoincide(p, movimiento)}
                onClick={() => publicar("asiento_vinculado_confirmado", { idasiento: p.idasiento, importe: p.importe })}
            >
                Vincular
            </QBoton>
        ),
    },
];

interface TabPartidasProps {
    movimiento: MovimientoBancario;
    publicar: EmitirEvento;
}

/**
 * Muestra las partidas contables huérfanas de la cuenta bancaria del movimiento:
 * entradas en co_partidas contra la subcuenta bancaria sin movimiento bancario
 * conciliado equivalente. El usuario puede vincular una de ellas al movimiento
 * activo pulsando "Vincular" (emite `asiento_vinculado_confirmado` con el idasiento
 * y el importe). Solo aparece el botón habilitado cuando el importe de la partida
 * coincide con el del movimiento (tolerancia ±0.01).
 *
 * Solo tiene sentido mostrarlo cuando el movimiento está pendiente o con candidatos.
 */
export const TabPartidas = ({ movimiento, publicar }: TabPartidasProps) => {

    const [partidas, setPartidas] = useState<PartidaHuerfana[]>([]);
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        if (!movimiento.cuentaConexionId) return;
        setCargando(true);
        getPartidasHuerfanas(movimiento.cuentaConexionId)
            .then(setPartidas)
            .finally(() => setCargando(false));
    }, [movimiento.cuentaConexionId]);

    if (cargando) {
        return <p className="TabPartidas-vacio">Cargando partidas contables…</p>;
    }

    if (partidas.length === 0) {
        return <p className="TabPartidas-vacio">No hay partidas contables sin movimiento bancario para esta cuenta.</p>;
    }

    const columnas = getColumnas(publicar, movimiento);

    return (
        <div className="TabPartidas">
            <p className="TabPartidas-descripcion">
                Partidas contables en la subcuenta bancaria sin movimiento conciliado equivalente.
                Pulsa «Vincular» para marcar este movimiento como ya contabilizado en ese asiento.
            </p>
            <table className="TabPartidas-tabla">
                <thead>
                    <tr>
                        {columnas.map((col) => (
                            <th key={col.id} className={col.tipo ?? ""}>{col.cabecera}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {partidas.map((partida) => (
                        <tr key={partida.idasiento}>
                            {columnas.map((col) => (
                                <td key={col.id} className={col.tipo ?? ""}>{col.render(partida)}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
