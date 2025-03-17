import { PropsWithChildren, useContext, useState } from "react";
import { Contexto } from "../../contextos/comun/contexto.ts";
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

  const context = useContext(Contexto);
  if (!context) {
    throw new Error("Contexto is null");
  }
  const { entidades, setEntidades } = context;

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

  const crear = (data: T) =>
    crearUno(data).then(({ id }) => {
      obtenerUno(id).then((entidad: T | null) => {
        if (!entidad) return;
        setEntidades([...entidades, entidad]);
      });
    });

  const actualizar = (data: T) =>
    actualizarUno(id, data).then(() => {
      const indice = entidades.findIndex((e) => e.id === id);
      if (indice === -1) return;
      setEntidades(entidades.with(indice, data));
    });

  const handleSubmit = async (data: T) =>
    esNuevo ? crear(data) : actualizar(data);

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
