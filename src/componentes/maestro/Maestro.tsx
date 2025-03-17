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
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState<{ [campo: string]: string } | null>(
    null
  );

  const context = useContext(Contexto);
  if (!context) {
    throw new Error("Contexto nulo");
  }
  const { entidades, setEntidades, seleccionada, setSeleccionada } = context;

  useEffect(() => {
    let hecho = false;

    obtenerTodos().then((entidades) => {
      if (!hecho) {
        setEntidades(entidades as T[]);
        setCargando(false);
      }
    });

    return () => {
      hecho = true;
    };
  }, [obtenerTodos, setEntidades]);

  const entidadesFiltradas = entidades.filter((entidad) => {
    if (!filtro) return true;

    return Object.entries(filtro).every(([campo, valor]) => {
      if (!campo.includes(".")) {
        return (entidad[campo] as string)
          .toLowerCase()
          .includes(valor.toLocaleLowerCase());
      }

      const [clave, claveInterna] = campo.split(".");
      return (entidad[clave] as Record<string, string>)[claveInterna]
        .toLocaleLowerCase()
        .includes(valor.toLocaleLowerCase());
    });
  });

  const renderEntidades = () => {
    if (cargando) return <MaestroCargando />;
    if (entidadesFiltradas.length === 0) return <SinDatos />;

    return (
      <Tabla
        datos={entidadesFiltradas}
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
      <MaestroFiltros acciones={acciones} setFiltro={setFiltro} />
      {renderEntidades()}
    </div>
  );
};
