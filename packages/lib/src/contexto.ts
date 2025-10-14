import React from "react";

// export type ContextoSet<T> = (_: (T) | ((_: T) => T)) => void;

// export type Contexto<T> = {
//   entidades: T[];
//   setEntidades: ContextoSet<T[]>;
//   seleccionada: T | null;
//   setSeleccionada: ContextoSet<T | null>;
// };


export type QError = {
  nombre: string;
  descripcion?: string;
};

export type Intentar = <Out>(f: () => Out) => Promise<Out>;
export type TipoContextoError = {
  error: QError | null;
  setError: (_: QError) => void;
  intentar: Intentar;
};

export const ContextoError = React.createContext<TipoContextoError>({
  error: null,
  setError: () => { },
  intentar: async (f) => {
    return await f();
  }
});