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

  const { actualizarUno, obtenerUno } = acciones;

  useEffect(() => {
    obtenerUno(id).then((entidad) => setEntidad(entidad as T));
  }, [id, obtenerUno]);

  if (!entidad || !entidad.id) {
    return <>No se ha encontrado la entidad con Id: {id}</>;
  }

  return (
    <div className={detalle}>
      {obtenerTitulo && <h2>{obtenerTitulo(entidad)}</h2>}
      <FormularioGenerico
        campos={camposEntidad}
        entidad={entidad}
        setEntidad={setEntidad}
        onSubmit={actualizarUno}
      />
      {children}
    </div>
  );
}
