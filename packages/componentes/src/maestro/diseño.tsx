import {
  Criteria,
  Entidad,
  Filtro,
  Orden,
  Paginacion,
  RespuestaLista
} from "@olula/lib/diseño.ts";
import { ReactNode } from "react";
import { MetaTabla } from "../atomos/qtabla.tsx";

export type ModoVisualizacion = "tabla" | "tarjetas";
export type ModoDisposicion =
  | "maestro-50"
  | "maestro-dinamico"
  | "pantalla-completa"
  | "modal";

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
  modoVisualizacion?: ModoVisualizacion;
  setModoVisualizacion?: (modo: ModoVisualizacion) => void;
  modoDisposicion?: ModoDisposicion;
  setModoDisposicion?: (modo: ModoDisposicion) => void;
  cargar: (
    filtro: Filtro,
    orden: Orden,
    paginacion: Paginacion
  ) => RespuestaLista<T>;
  nombreModal?: string;
  onCerrarDetalle?: () => void;
};

export type MaestroDetalleControladoProps<T extends Entidad> = {
  seleccionada: T | null;
  preMaestro?: ReactNode;
  Detalle: ReactNode;
  metaTabla?: MetaTabla<T>;
  tarjeta?: (entidad: T) => React.ReactNode;
  criteria?: Criteria;
  entidades: T[];
  totalEntidades: number;
  modoVisualizacion?: ModoVisualizacion;
  setModoVisualizacion?: (modo: ModoVisualizacion) => void;
  modoDisposicion?: ModoDisposicion;
  setModoDisposicion?: (modo: ModoDisposicion) => void;
  nombreModal?: string;
  onCerrarDetalle?: () => void;
  recargar: (filtro: Filtro, orden: Orden, paginacion: Paginacion) => void;
  setSeleccionada: (seleccionada: T) => void;

};