import { Entidad } from "@olula/lib/diseño.ts";
import { useEffect, useRef, useState } from "react";
import { QModal } from "../moleculas/qmodal.tsx";
import { MaestroDetalleControladoProps, ModoVisualizacion } from "./diseño.tsx";
import { ListadoControlado } from "./ListadoControlado.tsx";
import "./MaestroDetalle.css";
import { useEsMovil } from "./useEsMovil.ts";

export function MaestroDetalleControlado<T extends Entidad>(
  props: MaestroDetalleControladoProps<T>
) {
    const {
        seleccionada,
        preMaestro,
        Detalle,
        metaTabla,
        tarjeta,
        criteria,
        entidades,
        totalEntidades = 0,
        modoVisualizacion: modoVisualizacionProp = tarjeta ? "tarjetas" : "tabla",
        setModoVisualizacion: setModoVisualizacionProp,
        modoDisposicion: modoDisposicionProp,
        nombreModal = "detalle",
        onCerrarDetalle,
        recargar,
        setSeleccionada,
    } = props;

    const esMovil = useEsMovil();

    const getModoDisposicionInicial = () => {
        if (modoDisposicionProp) return modoDisposicionProp;
        return modoVisualizacionProp === "tabla"
        ? "pantalla-completa"
        : "maestro-dinamico";
    };

    const [modoVisualizacion, setModoVisualizacion] = useState<ModoVisualizacion>(
        modoVisualizacionProp ?? "tabla"
    );
    const [modoDisposicion, setModoDisposicion] = useState<string>(
        getModoDisposicionInicial()
    );
    const [modalAbierto, setModalAbierto] = useState(false);
    const prevSeleccionada = useRef<T | null>(null);

    useEffect(() => {
        if (modoDisposicion === "modal") {
            if (seleccionada && seleccionada !== prevSeleccionada.current) {
                setModalAbierto(true);
            } else if (!seleccionada && prevSeleccionada.current) {
                setModalAbierto(false);
            }
        }

        prevSeleccionada.current = seleccionada;
    }, [seleccionada, modoDisposicion]);

    const handleSetModoVisualizacion = (nuevoModo: ModoVisualizacion) => {
        setModoVisualizacion(nuevoModo);
        if (setModoVisualizacionProp) setModoVisualizacionProp(nuevoModo);

        setModoDisposicion(
        nuevoModo === "tabla" ? "pantalla-completa" : "maestro-dinamico"
        );
    };

    const handleCerrarDetalle = () => {
        setModalAbierto(false);
        if (onCerrarDetalle) {
        onCerrarDetalle();
        }
    };

    const mostrarMaestro =
        modoDisposicion !== "modal" &&
        (!esMovil || !seleccionada || modoDisposicion === "pantalla-completa");

    const mostrarDetalle =
        modoDisposicion !== "modal" && (!esMovil || seleccionada);

    const claseMaestro = `
        Maestro 
        ${modoDisposicion === "maestro-dinamico" && seleccionada ? "contraido" : ""}
        ${modoDisposicion === "pantalla-completa" && seleccionada ? "oculto" : ""}
    `;

    const claseDetalle = `
        Detalle 
        ${modoDisposicion === "maestro-dinamico" && seleccionada ? "expandido" : ""}
        ${modoDisposicion === "pantalla-completa" && !seleccionada ? "oculto" : ""}
    `;

    if (modoDisposicion === "modal") {
        return (
        <maestro-detalle tipo="pantalla-completa">
            <div className="Maestro">
            {preMaestro}
            <ListadoControlado
                metaTabla={metaTabla}
                criteria={criteria}
                modo={modoVisualizacion}
                setModo={handleSetModoVisualizacion}
                tarjeta={tarjeta}
                entidades={entidades}
                totalEntidades={totalEntidades}
                seleccionada={seleccionada}
                setSeleccionada={setSeleccionada}
                recargar={recargar}
            />
            </div>
            <QModal
            nombre={nombreModal}
            abierto={modalAbierto}
            onCerrar={handleCerrarDetalle}
            >
            {Detalle}
            </QModal>
        </maestro-detalle>
        );
    }

    return (
        <maestro-detalle tipo={modoDisposicion}>
        {mostrarMaestro && (
            <div className={claseMaestro}>
            {preMaestro}
            <ListadoControlado
                metaTabla={metaTabla}
                criteria={criteria}
                modo={modoVisualizacion}
                setModo={handleSetModoVisualizacion}
                tarjeta={tarjeta}
                entidades={entidades}
                totalEntidades={totalEntidades}
                seleccionada={seleccionada}
                setSeleccionada={setSeleccionada}
                recargar={recargar}
            />
            </div>
        )}

        {mostrarDetalle && <div className={claseDetalle}>{Detalle}</div>}
        </maestro-detalle>
    );
}
