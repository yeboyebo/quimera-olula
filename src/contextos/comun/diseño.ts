export type Entidad = {
  id: string;
  [clave: string]: unknown;
};

// export type Acciones<T extends Entidad> = {
//   obtenerUno: (id: string) => Promise<T | null>;
//   // obtenerTodos: () => Promise<T[]>;
//   // crearUno: (entidad: T) => Promise<any>;
//   // actualizarUno: (id:string, entidad: Partial<T>) => Promise<void>;
//   // eliminarUno: (id: string) => Promise<void>;
//   // buscar?: (campo: string, valor: string) => Promise<T[]>;
//   // seleccionarEntidad?: (e: Entidad) => void;
// };

/* eslint-disable  @typescript-eslint/no-explicit-any */
export type Acciones<T extends Entidad> = {
  obtenerUno: (id: string) => Promise<T | null>;
  obtenerTodos: () => Promise<T[]>;
  crearUno: (entidad: T) => Promise<any>;
  actualizarUno: (id:string, entidad: any) => Promise<void>;
  eliminarUno: (id: string) => Promise<void>;
  buscar?: (campo: string, valor: string) => Promise<T[]>;
  seleccionarEntidad?: (e: Entidad) => void;
};
