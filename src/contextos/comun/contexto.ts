import React from "react";
import { Entidad } from "./diseño.ts";

export type ContextoSet<T> = (T) | ((_: T) => T);

export type Contexto<T> = {
  entidades: T[];
  setEntidades: (_: ContextoSet<T[]>) => void;
  seleccionada: T | null;
  setSeleccionada: (_: ContextoSet<T | null>) => void;
};

export const Contexto = React.createContext<Contexto<Entidad> | null>(null);
