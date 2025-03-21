import React from "react";
import { Entidad } from "../../comun/diseño.ts";

export type ContextoSet<T> = (_: (T) | ((_: T) => T)) => void;

export type Contexto<T> = {
    entidades: T[];
    setEntidades: ContextoSet<T[]>;
    seleccionada: T | null;
    setSeleccionada: ContextoSet<T | null>;
};

export const Contexto = React.createContext<Contexto<Entidad> | null>(null);