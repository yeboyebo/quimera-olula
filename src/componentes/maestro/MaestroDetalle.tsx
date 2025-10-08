import {
  Criteria,
  Entidad,
  Filtro,
  Orden,
  Paginacion,
  RespuestaLista,
} from "@quimera/lib/diseño.ts";
import { ReactNode, useEffect, useRef, useState } from "react";
import { MetaTabla } from "../atomos/qtabla.tsx";
import { QModal } from "../moleculas/qmodal.tsx";
import { Listado } from "./Listado.tsx";
import "./MaestroDetalle.css";
import { useEsMovil } from "./useEsMovil.ts";

type Modo = "tabla" | "tarjetas";

export type MaestroDetalleProps<T extends Entidad> = {
  seleccionada: T | null;
  preMaestro?: ReactNode;
  Detalle: ReactNode;
  metaTabla?: MetaTabla<T>;
  tarjeta?: (entidad: T) => React.ReactNode;
  criteria?: Criteria;
  entidades: T[];
  setEntidades: (entidades: T[]) => void;
  setSeleccionada: (seleccionada: T) => void;
  modo?: Modo;
  setModo?: (modo: Modo) => void;
  cargar: (
    filtro: Filtro,
    orden: Orden,
    paginacion: Paginacion
  ) => RespuestaLista<T>;
  nombreModal?: string;
  onCerrarDetalle?: () => void;
};

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
    modo: modoProp,
    setModo: setModoProp,
    cargar,
    nombreModal = "detalle",
    onCerrarDetalle,
  } = props;

  const esMovil = useEsMovil();
  const [modo, setModo] = useState<Modo>(modoProp ?? "tarjetas");
  const [modalAbierto, setModalAbierto] = useState(false);
  const prevSeleccionada = useRef<T | null>(null);

  useEffect(() => {
    if (modo === "tarjetas") {
      if (seleccionada && seleccionada !== prevSeleccionada.current) {
        setModalAbierto(true);
      } else if (!seleccionada) {
        setModalAbierto(false);
      }
      prevSeleccionada.current = seleccionada;
    }
  }, [seleccionada, modo]);

  //   useEffect(() => {
  //     if (modoProp && modoProp !== modo) {
  //       setModo(modoProp);
  //     }
  //   }, [modoProp]);

  const handleSetModo = (nuevoModo: Modo) => {
    setModo(nuevoModo);
    if (setModoProp) setModoProp(nuevoModo);
  };

  // Selector de modo
  //   const selectorModo = (
  //     <div style={{ marginBottom: 8 }}>
  //       <button
  //         onClick={() => handleSetModo("tabla")}
  //         disabled={modo === "tabla"}
  //         style={{ marginRight: 4 }}
  //       >
  //         Tabla
  //       </button>
  //       <button
  //         onClick={() => handleSetModo("tarjetas")}
  //         disabled={modo === "tarjetas"}
  //       >
  //         Tarjetas
  //       </button>
  //     </div>
  //   );

  if (modo === "tarjetas") {
    return (
      <maestro-detalle tipo="tarjetas">
        <div className="Maestro">
          {preMaestro}
          {/* {selectorModo} */}
          <Listado
            metaTabla={metaTabla}
            criteria={criteria}
            modo={modo}
            setModo={handleSetModo}
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
          onCerrar={() => {
            setModalAbierto(false);
            if (onCerrarDetalle) {
              onCerrarDetalle();
            }
          }}
        >
          {Detalle}
        </QModal>
      </maestro-detalle>
    );
  }

  return (
    <maestro-detalle tipo="tabla">
      {(!esMovil || !seleccionada) && (
        <div className="Maestro">
          {preMaestro}
          {/* {selectorModo} */}
          <Listado
            metaTabla={metaTabla}
            criteria={criteria}
            modo={modo}
            setModo={handleSetModo}
            tarjeta={tarjeta}
            entidades={entidades}
            setEntidades={setEntidades}
            seleccionada={seleccionada}
            setSeleccionada={setSeleccionada}
            cargar={cargar}
          />
        </div>
      )}
      {(!esMovil || seleccionada) && <div className="Detalle">{Detalle}</div>}
    </maestro-detalle>
  );
}
