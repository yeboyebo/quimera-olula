import React from "react";

export type Entidad = {
  id: string;
  [clave: string]: unknown;
};

export type Acciones<T extends Entidad> = {
  obtenerUno: (id: string) => Promise<T | null>;
  obtenerTodos: () => Promise<T[]>;
  crearUno: (entidad: T) => Promise<void>;
  actualizarUno: (entidad: Partial<T>) => Promise<void>;
  eliminarUno: (id: string) => Promise<void>;
  buscar?: (campo: string, valor: string) => Promise<T[]>;
  seleccionarEntidad?: (e: Entidad) => void;
};

export type MaestroContextType<T> = {
  entidades: T[];
  setEntidades: React.Dispatch<React.SetStateAction<T[]>>;
};

export const MaestroContext = (<T extends Entidad>() =>
  React.createContext<MaestroContextType<T> | null | object>(null))();
