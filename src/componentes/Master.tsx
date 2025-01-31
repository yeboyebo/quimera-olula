import { useEffect, useState } from "react";

type Entidad = {
  id: string;
  [clave: string]: string;
};

type MasterProps<T> = {
  acciones: {
    obtenerTodos: () => Promise<T[]>;
    obtenerUno: (id: string) => Promise<T | null>;
  };
};

export const Master = <T extends Entidad>({ acciones }: MasterProps<T>) => {
  const { obtenerTodos } = acciones;

  const [datos, setDatos] = useState<T[]>([]);

  useEffect(() => {
    obtenerTodos().then((datos) => setDatos(datos as T[]));
  }, [obtenerTodos]);

  return (
    <ul>
      {datos.map((dato) => {
        const { id, ...resto } = dato;
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
