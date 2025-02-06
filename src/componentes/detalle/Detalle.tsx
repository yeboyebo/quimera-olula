import { PropsWithChildren, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Acciones, Entidad } from "../../contextos/comun/diseño.ts";
import {
  CampoFormularioGenerico,
  FormularioGenerico,
} from "./FormularioGenerico";

interface DetalleProps<T extends Entidad> {
  acciones: Acciones<T>;
  obtenerTitulo?: (entidad: T) => string;
  camposEntidad: CampoFormularioGenerico[];
}

export function Detalle<T extends Entidad>({
  camposEntidad,
  acciones,
  obtenerTitulo,
  children,
}: PropsWithChildren<DetalleProps<T>>) {
  const { actualizarUno, obtenerUno } = acciones;

  const { id } = useParams();
  const [entidad, setEntidad] = useState<T>({} as T);

  useEffect(() => {
    obtenerUno(id ?? "0").then((entidad) => setEntidad(entidad as T));
  }, [id, obtenerUno]);

  if (!entidad.id) {
    return <>No se ha encontrado la entidad con Id: {id}</>;
  }

  return (
    <div className="Detalle">
      {obtenerTitulo && <h2>{obtenerTitulo(entidad)}</h2>}
      <FormularioGenerico
        campos={camposEntidad}
        valoresIniciales={entidad}
        onSubmit={actualizarUno}
      />
      {children}
    </div>
  );
}
