// MaestroDetalle.tsx
import { Entidad } from "@quimera/lib/diseño.ts";
import { useEffect, useRef, useState } from "react";
import { QModal } from "../moleculas/qmodal.tsx";
import {
  MaestroDetalleProps,
  ModoDisposicion,
  ModoVisualizacion,
} from "./diseño.tsx";
import { Listado } from "./Listado.tsx";
import "./MaestroDetalle.css";
import { useEsMovil } from "./useEsMovil.ts";

export function MaestroDetalle<T extends Entidad>(
  props: MaestroDetalleProps<T>
) {
  const {
    seleccionada,
    preMaestro,
    Detalle,
    metaTabla,
    tarjeta,
    criteria,
    entidades,
    setEntidades,
    setSeleccionada,
    modoVisualizacion: modoVisualizacionProp,
    setModoVisualizacion: setModoVisualizacionProp,
    modoDisposicion: modoDisposicionProp = "tabla",
    setModoDisposicion: setModoDisposicionProp,
    cargar,
    nombreModal = "detalle",
    onCerrarDetalle,
  } = props;

  const esMovil = useEsMovil();
  const [modoVisualizacion, setModoVisualizacion] = useState<ModoVisualizacion>(
    modoVisualizacionProp ?? "tarjetas"
  );
  const [modoDisposicion, setModoDisposicion] =
    useState<ModoDisposicion>(modoDisposicionProp);
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
  };

  const handleSetModoDisposicion = (nuevoModo: ModoDisposicion) => {
    setModoDisposicion(nuevoModo);
    if (setModoDisposicionProp) setModoDisposicionProp(nuevoModo);
  };

  const handleCerrarDetalle = () => {
    setModalAbierto(false);
    if (onCerrarDetalle) {
      onCerrarDetalle();
    }
  };

  // Selector de modos
  const SelectorModos = () => (
    <div className="selector-modos">
      <div>
        <strong>Disposición:</strong>
        <button
          onClick={() => handleSetModoDisposicion("tabla")}
          className={modoDisposicion === "tabla" ? "activo" : ""}
        >
          50/50
        </button>
        <button
          onClick={() => handleSetModoDisposicion("maestro-dinamico")}
          className={modoDisposicion === "maestro-dinamico" ? "activo" : ""}
        >
          20/80
        </button>
        <button
          onClick={() => handleSetModoDisposicion("modal")}
          className={modoDisposicion === "modal" ? "activo" : ""}
        >
          Modal
        </button>
        <button
          onClick={() => handleSetModoDisposicion("pantalla-completa")}
          className={modoDisposicion === "pantalla-completa" ? "activo" : ""}
        >
          100%
        </button>
      </div>
    </div>
  );

  // Lógica unificada para todos los modos
  const mostrarMaestro =
    modoDisposicion !== "modal" &&
    (!esMovil || !seleccionada || modoDisposicion === "pantalla-completa");

  const mostrarDetalle =
    modoDisposicion !== "modal" && (!esMovil || seleccionada);

  // Clases condicionales
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
          <SelectorModos />
          <Listado
            metaTabla={metaTabla}
            criteria={criteria}
            modo={modoVisualizacion}
            setModo={handleSetModoVisualizacion}
            tarjeta={tarjeta}
            entidades={entidades}
            setEntidades={setEntidades}
            seleccionada={seleccionada}
            setSeleccionada={setSeleccionada}
            cargar={cargar}
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
          <SelectorModos />
          <Listado
            metaTabla={metaTabla}
            criteria={criteria}
            modo={modoVisualizacion}
            setModo={handleSetModoVisualizacion}
            tarjeta={tarjeta}
            entidades={entidades}
            setEntidades={setEntidades}
            seleccionada={seleccionada}
            setSeleccionada={setSeleccionada}
            cargar={cargar}
          />
        </div>
      )}

      {mostrarDetalle && <div className={claseDetalle}>{Detalle}</div>}
    </maestro-detalle>
  );
}
