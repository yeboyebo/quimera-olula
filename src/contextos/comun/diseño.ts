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
};
