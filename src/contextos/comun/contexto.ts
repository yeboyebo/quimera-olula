import React from "react";
import { Entidad } from "./diseño.ts";

export type Contexto<T> = {
  entidades: T[];
  setEntidades: (_: T[]) => void;
  seleccionada: T | null;
  setSeleccionada: (_: T | null) => void;
};

// export const Contexto = (<T extends Entidad>() =>
//   React.createContext<Contexto<T> | null>(null))();

export const Contexto = React.createContext<Contexto<Entidad> | null>(null);
