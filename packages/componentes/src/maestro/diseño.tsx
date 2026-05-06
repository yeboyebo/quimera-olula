import { Entidad } from "@olula/lib/diseño.ts";
import { ReactNode } from "react";

export type ModoVisualizacion = "tabla" | "tarjetas";
export type ModoDisposicion =
  | "maestro-50"
  | "maestro-dinamico"
  | "pantalla-completa"
  | "modal";

export type MaestroDetalleProps<T extends Entidad> = {
  seleccionada: T | null;
  Maestro: ReactNode;
  Detalle: ReactNode;
  modoVisualizacion?: ModoVisualizacion;
  // setModoVisualizacion?: (modo: ModoVisualizacion) => void;
  modoDisposicion?: ModoDisposicion;
  setModoDisposicion?: (modo: ModoDisposicion) => void;
  nombreModal?: string;
  onCerrarDetalle?: () => void;
  layout?: "TARJETA" | "TABLA";
};
