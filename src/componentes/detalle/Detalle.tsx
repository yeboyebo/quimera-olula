import { PropsWithChildren, useEffect, useState } from "react";
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

  const [entidad, setEntidad] = useState<T>({} as T);
  const [isNew, setIsNew] = useState<boolean>(false);

  const { actualizarUno, obtenerUno, crearUno } = acciones;

  useEffect(() => {
    if (!id || id === "") {
      const nuevaEntidad = camposEntidad.reduce((acc, campo) => {
        return { ...acc, [campo.nombre]: campo.valorInicial || "" };
      }, {} as Partial<T>) as T;
      setEntidad(nuevaEntidad);
      setIsNew(true);
    } else {
      obtenerUno(id).then((entidad) => {
        setIsNew(false);
        setEntidad(entidad as T);
      });
    }
  }, [id, obtenerUno, camposEntidad]);

  if (!entidad || !Object.keys(entidad).length) {
    return <>No se ha encontrado la entidad con Id: {id}</>;
  }
  console.log(entidad);
  const handleSubmit = async (id: string, data: T) => {
    if (isNew) {
      await crearUno(data);
    } else {
      await actualizarUno(id, data);
    }
  };

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
