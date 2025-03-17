import { PropsWithChildren, useState } from "react";
import { Acciones, Entidad } from "../../contextos/comun/diseño.ts";
import estilos from "./detalle.module.css";
import {
  CampoFormularioGenerico,
  FormularioGenerico,
} from "./FormularioGenerico";

interface DetalleProps<T extends Entidad> {
  id: string;
  acciones: Acciones<T>;
  obtenerTitulo?: (entidad: T) => string;
  camposEntidad: CampoFormularioGenerico[];
}

export function Detalle<T extends Entidad>({
  id,
  camposEntidad,
  acciones,
  obtenerTitulo,
  children,
}: PropsWithChildren<DetalleProps<T>>) {
  const { detalle } = estilos;

  const [entidad, setEntidad] = useState<T | null>(null);

  const esNuevo = id === "";
  const existe = id !== "0";

  const { actualizarUno, obtenerUno, crearUno } = acciones;

  if (!entidad || id !== entidad.id) {
    if (!existe) return;

    if (esNuevo) {
      const nuevaEntidad = camposEntidad.reduce((acc, campo) => {
        return { ...acc, [campo.nombre]: campo.valorInicial || "" };
      }, {}) as T;
      setEntidad(nuevaEntidad);
      return;
    }

    obtenerUno(id)
      .then((entidad) => {
        setEntidad(entidad as T);
      })
      .catch(() => {
        setEntidad({} as T);
      });
  }

  if (!entidad) {
    return <>No se ha encontrado la entidad con Id: {id}</>;
  }

  const handleSubmit = async (id: string, data: T) =>
    esNuevo ? crearUno(data) : actualizarUno(id, data);

  return (
    <div className={detalle}>
      {obtenerTitulo && <h2>{obtenerTitulo(entidad)}</h2>}
      <FormularioGenerico
        campos={camposEntidad}
        entidad={entidad}
        setEntidad={setEntidad}
        onSubmit={handleSubmit}
      />
      {children}
    </div>
  );
}
