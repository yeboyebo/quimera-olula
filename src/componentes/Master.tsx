import React, { useEffect, useState } from "react";
import { MasterAcciones } from "./MasterAcciones/MasterAcciones";
import { MasterEntidad } from "./MasterEntidad/MasterEntidad";
import { MasterFiltros } from "./MasterFiltros/MasterFiltros";
import { MasterCargando } from "./MasterCargando/MasterCargando";
import { SinDatos } from "./SinDatos/SinDatos";

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
    buscar?: (campo: string, valor: string) => Promise<T[]>;
  };
};

type MasterContextType<T> = {
  entidades: T[];
  setEntidades: React.Dispatch<React.SetStateAction<T[]>>;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MasterContext = React.createContext<MasterContextType<any> | null>(null);

export const Master = <T extends Entidad>({ acciones }: MasterProps<T>) => {
  const { obtenerTodos } = acciones;

  const [entidades, setEntidades] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    obtenerTodos().then((entidades) => {setEntidades(entidades as T[]); setIsLoading(false);})
  }, [obtenerTodos]);

  const renderEntidades = () => {

    if(isLoading) {
      return <MasterCargando />;
    }

    if(entidades.length === 0 || true) {
      return <SinDatos />;
    }

    return (
      <ul className="MasterEntidades" style={{ float: "left", width: "100%" }}>
        {entidades.map((entidad) => {
          const { id } = entidad;
          return (
            <MasterEntidad key={id} entidad={entidad} />
          );
        })}
      </ul>
    );
  };

    return (
      <MasterContext.Provider value={{ entidades, setEntidades } as MasterContextType<T>}>
        <div className="Master">
          <MasterAcciones acciones={acciones} />
          <MasterFiltros acciones={acciones} />
          { renderEntidades() }
        </div>
      </MasterContext.Provider>
    );

};
