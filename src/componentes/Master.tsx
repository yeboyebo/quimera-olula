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
  const { obtenerTodos, crearUno, actualizarUno } = acciones;

  const [entidades, setEntidades] = useState<T[]>([]);

  const onCrearNuevo = () => {
    const nuevaEntidad = {
      id: (entidades.length + 1).toString().padStart(6, "0"),
      nombre: [
        "Michel Jordan",
        "Lebron James",
        "Kobe Bryant",
        "Stephen Curry",
        "Kevin Durant",
        "James Harden",
        "Anthony Davis",
        "Giannis Antetokounmpo",
        "Luka Doncic",
        "Damian Lillard",
      ][entidades.length % 10],
      id_fiscal: "53631867F",
    } as unknown as T;

    crearUno(nuevaEntidad).then(() => {
      setEntidades([nuevaEntidad, ...entidades]);
    });
  };

  const onActualizarPrimero = () => {
    const primeraEntidad = entidades[0];

    const nuevaEntidad = {
      id: primeraEntidad.id,
      nombre: primeraEntidad.nombre + " (actualizado)",
      nada: "",
    } as unknown as Partial<T>;

    actualizarUno(nuevaEntidad).then(() => {
      setEntidades([
        { ...primeraEntidad, nombre: nuevaEntidad.nombre },
        ...entidades.slice(1),
      ]);
    });
  };

  const onEliminarPrimero = () => {
    acciones.eliminarUno(entidades[0].id).then(() => {
      setEntidades(entidades.slice(1));
    });
  };

  useEffect(() => {
    obtenerTodos().then((entidades) => setEntidades(entidades as T[]));
  }, [obtenerTodos]);

  return (
    <ul>
      <button onClick={onCrearNuevo}>Crear nuevo</button>
      <button onClick={onActualizarPrimero}>Actualizar primero</button>
      <button onClick={onEliminarPrimero}>Eliminar primero</button>
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
