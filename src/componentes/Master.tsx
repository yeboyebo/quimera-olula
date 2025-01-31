import { useEffect, useState } from "react";

type Entidad = {
  id: string;
  [clave: string]: string;
};

type MasterProps<T> = {
  acciones: {
    obtenerTodos: () => Promise<T[]>;
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
      {datos.map((dato) => (
        <li key={dato.id}>{dato.nombre}</li>
      ))}
    </ul>
  );
};
