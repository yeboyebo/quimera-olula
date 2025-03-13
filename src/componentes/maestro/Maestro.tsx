import { useContext, useEffect, useState } from "react";
import { Contexto } from "../../contextos/comun/contexto.ts";
import { Acciones, Entidad } from "../../contextos/comun/diseño.ts";
import { CampoFormularioGenerico } from "../detalle/FormularioGenerico.tsx";
import { SinDatos } from "../SinDatos/SinDatos.tsx";
import { Tabla } from "../wrappers/tabla.tsx";
import { MaestroAcciones } from "./maestroAcciones/MaestroAcciones.tsx";
import { MaestroCargando } from "./maestroCargando/MaestroCargando.tsx";
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
  const { entidades, setEntidades, seleccionada, setSeleccionada } = context;

  useEffect(() => {
    obtenerTodos().then((entidades) => {
      setEntidades(entidades as T[]);
      setIsLoading(false);
    });
  }, [obtenerTodos, setEntidades]);

  const renderEntidades = () => {
    if (isLoading) return <MaestroCargando />;
    if (entidades.length === 0) return <SinDatos />;

    return (
      <Tabla
        datos={entidades}
        seleccionadaId={seleccionada?.id}
        onSeleccion={setSeleccionada}
      />
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
