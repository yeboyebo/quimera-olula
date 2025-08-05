import { ReactNode } from "react";
import { Entidad } from "../../contextos/comun/diseño.ts";
import "./qlista.css";

export type QListaProps<T extends Entidad> = {
  render?: (entidad: T) => ReactNode;
  datos: T[];
  cargando: boolean;
  seleccionadaId?: string;
  onSeleccion?: (entidad: T) => void;
};

export const QLista = <T extends Entidad>({
  render,
  datos,
}: QListaProps<T>) => {
  if (!render) return null;

  return (
    <quimera-lista>{datos.map((entidad: T) => render(entidad))}</quimera-lista>
  );
};
