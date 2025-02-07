import React, { useEffect, useState } from "react";
import { Acciones, Entidad } from "../../contextos/comun/diseño.ts";
import { SinDatos } from "../SinDatos/SinDatos.tsx";
import { MaestroAcciones } from "./maestroAcciones/MaestroAcciones.tsx";
import { MaestroCargando } from "./maestroCargando/MaestroCargando.tsx";
import { MaestroEntidad } from "./maestroEntidad/MaestroEntidad.tsx";
import { MaestroFiltros } from "./maestroFiltros/MaestroFiltros.tsx";

export type MaestroProps<T extends Entidad> = {
  acciones: Acciones<T>;
};

type MaestroContextType<T> = {
  entidades: T[];
  setEntidades: React.Dispatch<React.SetStateAction<T[]>>;
};

export const MaestroContext = (<T extends Entidad>() =>
  React.createContext<MaestroContextType<T> | null | object>(null))();

export const Maestro = <T extends Entidad>({ acciones }: MaestroProps<T>) => {
  const { obtenerTodos } = acciones;

  const [entidades, setEntidades] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    obtenerTodos().then((entidades) => {
      setEntidades(entidades as T[]);
      setIsLoading(false);
    });
  }, [obtenerTodos]);

  const renderEntidades = () => {
    if (isLoading) {
      return <MaestroCargando />;
    }

    if (entidades.length === 0) {
      return <SinDatos />;
    }

    return (
      <ul className="MaestroEntidades" style={{ float: "left", width: "100%" }}>
        {entidades.map((entidad) => {
          const { id } = entidad;
          return <MaestroEntidad key={id} entidad={entidad} />;
        })}
      </ul>
    );
  };

  return (
    <MaestroContext.Provider
      value={{ entidades, setEntidades } as MaestroContextType<T>}
    >
      <div className="Maestro">
        <MaestroAcciones acciones={acciones} />
        <MaestroFiltros acciones={acciones} />
        {renderEntidades()}
      </div>
    </MaestroContext.Provider>
  );
};
