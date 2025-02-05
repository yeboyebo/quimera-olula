import React, { useEffect, useState, Dispatch } from "react";
import { MasterAcciones } from "./MasterAcciones/MasterAcciones";
import { MasterEntidad } from "./MasterEntidad/MasterEntidad";
import { MasterFiltros } from "./MasterFiltros/MasterFiltros";

export type Entidad = {
  id: string;
  [clave: string]: string;
};

export type MasterProps<T> = {
  acciones: {
    obtenerTodos: () => Promise<T[]>;
    obtenerUno: (id: string) => Promise<T | null>;
    crearUno: (entidad: T) => Promise<void>;
    actualizarUno: (entidad: Partial<T>) => Promise<void>;
    eliminarUno: (id: string) => Promise<void>;
  };
};

type MasterContextType<T> = {
  entidades: T[];
  setEntidades: React.Dispatch<React.SetStateAction<T[]>>;
}

export const MasterContext = React.createContext<MasterContextType<any> | null>(null);

export const Master = <T extends Entidad>({ acciones }: MasterProps<T>) => {
  const { obtenerTodos } = acciones;

  const [entidades, setEntidades] = useState<T[]>([]);


  useEffect(() => {
    obtenerTodos().then((entidades) => setEntidades(entidades as T[]));
  }, [obtenerTodos]);

  return (
    <MasterContext.Provider value={{ entidades, setEntidades } as MasterContextType<T>}>
      <div className="Master">
        <MasterAcciones acciones={acciones} />
        <MasterFiltros acciones={acciones} />
        <ul className="MasterEntidades" style={{ float: "left", width: "100%" }}>
          {entidades.map((entidad) => {
            const { id, ...resto } = entidad;
            return (
              <MasterEntidad key={id} entidad={entidad} />
            );
          })}
        </ul>
      </div>
    </MasterContext.Provider>
  );
};
