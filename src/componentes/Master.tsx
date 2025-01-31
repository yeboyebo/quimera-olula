import { useEffect, useState } from "react";

type Entidad = {
  id: string;
  [clave: string]: string;
};

type MasterProps<T> = {
  acciones: {
    obtenerTodos: () => Promise<T[]>;
    obtenerUno: (id: string) => Promise<T | null>;
    crearUno: (entidad: T) => Promise<void>;
    actualizarUno: (entidad: Partial<T>) => Promise<void>;
    eliminarUno: (id: string) => Promise<void>;
  };
};

export const Master = <T extends Entidad>({ acciones }: MasterProps<T>) => {
  const { obtenerTodos } = acciones;

  const [entidades, setEntidades] = useState<T[]>([]);

  useEffect(() => {
    obtenerTodos().then((entidades) => setEntidades(entidades as T[]));
  }, [obtenerTodos]);

  return (
    <ul>
      {entidades.map((entidad) => {
        const { id, ...resto } = entidad;
        return (
          <li key={id} style={{ display: "flex", flexDirection: "column" }}>
            <span>Cliente: {id}</span>
            {Object.entries(resto).map(([clave, valor]) => (
              <span style={{ marginLeft: "1rem" }} key={clave}>
                {clave}: {valor}
              </span>
            ))}
          </li>
        );
      })}
    </ul>
  );
};
