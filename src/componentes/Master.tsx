import React, { useEffect, useState } from "react";
import { Acciones, Entidad } from "../contextos/comun/diseño.ts";
import { MasterAcciones } from "./MasterAcciones/MasterAcciones";
import { MasterEntidad } from "./MasterEntidad/MasterEntidad";
import { MasterFiltros } from "./MasterFiltros/MasterFiltros";

export type MasterProps<T extends Entidad> = {
  acciones: Acciones<T>;
};

type MasterContextType<T> = {
  entidades: T[];
  setEntidades: React.Dispatch<React.SetStateAction<T[]>>;
};

export const MasterContext = React.createContext<MasterContextType<any> | null>(
  null
);

export const Master = <T extends Entidad>({ acciones }: MasterProps<T>) => {
  const { obtenerTodos } = acciones;

  const [entidades, setEntidades] = useState<T[]>([]);

  useEffect(() => {
    obtenerTodos().then((entidades) => setEntidades(entidades as T[]));
  }, [obtenerTodos]);

  return (
    <MasterContext.Provider
      value={{ entidades, setEntidades } as MasterContextType<T>}
    >
      <div className="Master">
        <MasterAcciones acciones={acciones} />
        <MasterFiltros />
        <ul
          className="MasterEntidades"
          style={{ float: "left", width: "100%" }}
        >
          {entidades.map((entidad) => {
            const { id } = entidad;
            return <MasterEntidad key={id} entidad={entidad} />;
          })}
        </ul>
      </div>
    </MasterContext.Provider>
  );
};
