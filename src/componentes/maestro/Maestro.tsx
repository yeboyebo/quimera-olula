import { useContext, useEffect, useState } from "react";
import { Contexto } from "../../contextos/comun/contexto.ts";
import { Acciones, Entidad } from "../../contextos/comun/diseño.ts";
import { CampoFormularioGenerico } from "../detalle/FormularioGenerico.tsx";
import { SinDatos } from "../SinDatos/SinDatos.tsx";
import { MaestroAcciones } from "./maestroAcciones/MaestroAcciones.tsx";
import { MaestroCargando } from "./maestroCargando/MaestroCargando.tsx";
import { MaestroEntidad } from "./maestroEntidad/MaestroEntidad.tsx";
import { MaestroFiltros } from "./maestroFiltros/MaestroFiltros.tsx";

/* eslint-disable  @typescript-eslint/no-explicit-any */
export type MaestroProps<T extends Entidad> = {
  acciones: Acciones<T>;
  Acciones?: any;
  camposEntidad: CampoFormularioGenerico[];
};

export const Maestro = <T extends Entidad>({
  acciones,
  Acciones = null,
  camposEntidad,
}: MaestroProps<T>) => {
  const { obtenerTodos } = acciones;
  const [isLoading, setIsLoading] = useState(true);

  const context = useContext(Contexto);
  if (!context) {
    throw new Error("Contexto nulo");
  }
  const { entidades, setEntidades, setSeleccionada } = context;

  useEffect(() => {
    obtenerTodos().then((entidades) => {
      console.log("entidades = ", entidades);
      setEntidades(entidades as T[]);
      setIsLoading(false);
    });
  }, [obtenerTodos, setEntidades]);

  const renderCabecera = () => {
    const { id, ...resto } = entidades[0];
    return (
      <li className="CabeceraMaestroEntidad">
        <span className="id" data-id={id}>
          ID
        </span>
        {Object.entries(resto)
          .filter(([, valor]) => !Array.isArray(valor))
          .flatMap(([clave, valor]) => {
            if (valor?.constructor !== Object) return [[clave, valor]];

            return Object.entries(valor).map(([claveInterna, valor]) => [
              claveInterna,
              valor,
            ]);
          })
          .map(([clave]) => (
            <span key={clave} style={{ marginLeft: "1rem" }}>
              {clave}
            </span>
          ))}
      </li>
    );
  };

  const renderEntidades = () => {
    console.log("entidades = ", entidades);
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
          width: "100%",
          overflow: "auto",
          maxHeight: "70vh",
          flexDirection: "column",
          display: "flex",
        }}
      >
        {renderCabecera()}
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
      {Acciones ? (
        <Acciones acciones={acciones} camposEntidad={camposEntidad} />
      ) : (
        <MaestroAcciones acciones={acciones} camposEntidad={camposEntidad} />
      )}
      <MaestroFiltros acciones={acciones} />
      {renderEntidades()}
    </div>
  );
};
