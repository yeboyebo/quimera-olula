import { useContext, useEffect, useState } from "react";
import { Contexto } from "../../contextos/comun/contexto.ts";
import { Acciones, Entidad } from "../../contextos/comun/diseño.ts";
import { SinDatos } from "../SinDatos/SinDatos.tsx";
import { MaestroAcciones } from "./maestroAcciones/MaestroAcciones.tsx";
import { MaestroCargando } from "./maestroCargando/MaestroCargando.tsx";
import { MaestroEntidad } from "./maestroEntidad/MaestroEntidad.tsx";
import { MaestroFiltros } from "./maestroFiltros/MaestroFiltros.tsx";

export type MaestroProps<T extends Entidad> = {
  acciones: Acciones<T>;
};

export const Maestro = <T extends Entidad>({ acciones }: MaestroProps<T>) => {
  const { obtenerTodos } = acciones;
  const [isLoading, setIsLoading] = useState(true);

  const context = useContext(Contexto);
  if (!context) {
    throw new Error("Contexto nulo");
  }
  const { entidades, setEntidades, setSeleccionada } = context;

  useEffect(() => {
    obtenerTodos().then((entidades) => {
      setEntidades(entidades as T[]);
      setIsLoading(false);
    });
  }, [obtenerTodos, setEntidades]);

  const renderEntidades = () => {
    if (isLoading) {
      return <MaestroCargando />;
    }

    if (entidades.length === 0) {
      return <SinDatos />;
    }

    return (
      <ul
        className="MaestroEntidades"
        style={{
          float: "left",
          width: "100%",
          listStyle: "none",
          paddingLeft: 0,
        }}
      >
        {entidades.map((entidad) => {
          const { id } = entidad;
          return (
            <MaestroEntidad
              key={id}
              entidad={entidad}
              onClick={setSeleccionada}
            />
          );
        })}
      </ul>
    );
  };

  return (
    <div className="Maestro">
      <MaestroAcciones acciones={acciones} />
      <MaestroFiltros acciones={acciones} />
      {renderEntidades()}
    </div>
  );
};
