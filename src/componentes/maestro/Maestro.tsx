import { useContext, useEffect, useState } from "react";
import {
  Acciones,
  Entidad,
  MaestroContext,
  type MaestroContextType,
} from "../../contextos/comun/diseño.ts";
import { SinDatos } from "../SinDatos/SinDatos.tsx";
import { MaestroAcciones } from "./maestroAcciones/MaestroAcciones.tsx";
import { MaestroCargando } from "./maestroCargando/MaestroCargando.tsx";
import { MaestroEntidad } from "./maestroEntidad/MaestroEntidad.tsx";
import { MaestroFiltros } from "./maestroFiltros/MaestroFiltros.tsx";

export type MaestroProps<T extends Entidad> = {
  acciones: Acciones<T>;
};

export const Maestro = <T extends Entidad>({ acciones }: MaestroProps<T>) => {
  const { obtenerTodos, seleccionarEntidad } = acciones;
  const [isLoading, setIsLoading] = useState(true);
  const context = useContext(MaestroContext) as MaestroContextType<T>;
  if (!context) {
    throw new Error("MaestroContext is null");
  }
  const { entidades, setEntidades } = context;
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
          return (
            <MaestroEntidad
              key={id}
              entidad={entidad}
              onClick={seleccionarEntidad}
            />
          );
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
