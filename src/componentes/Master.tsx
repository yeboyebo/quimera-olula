import { useEffect, useState } from "react";

type MasterProps = {
  acciones: {
    obtenerTodos: () => Promise<any[]>;
  };
};

export const Master = ({ acciones }: MasterProps) => {
  const { obtenerTodos } = acciones;

  const [datos, setDatos] = useState<any[]>([]);

  useEffect(() => {
    obtenerTodos().then((datos) => setDatos(datos));
  }, []);

  return (
    <ul>
      {datos.map((dato) => (
        <li key={dato.id}>{dato.nombre}</li>
      ))}
    </ul>
  );
};
