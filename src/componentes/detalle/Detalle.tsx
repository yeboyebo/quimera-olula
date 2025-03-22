import { PropsWithChildren, useEffect } from "react";
import { Entidad } from "../../contextos/comun/diseño.ts";
import estilos from "./detalle.module.css";

interface DetalleProps<T extends Entidad> {
  id: string | undefined;
  obtenerTitulo?: (entidad: T) => string;
  entidad: T | null;
  setEntidad: (entidad: T) => void;
  cargar: (id: string) => Promise<T>;
}

export function Detalle<T extends Entidad>({
  id,
  obtenerTitulo,
  children,
  entidad,
  setEntidad,
  cargar,
}: PropsWithChildren<DetalleProps<T>>) {
  const { detalle } = estilos;

  useEffect(() => {
    if (id && (!entidad || id !== entidad.id)) {
      const load = async () => {
        const cliente = await cargar(id)
        if(cliente) {
          setEntidad(cliente);
        }
      }
      load();
    }
  }, [id, entidad]);

  if (!entidad) {
    return <>No se ha encontrado la entidad con Id: {id}</>;
  }

  if (!id) {
    return <></>;
  }

  return (
    <div className={detalle}>
      {obtenerTitulo && <h2>{obtenerTitulo(entidad)}</h2>}
      {children}
    </div>
  );
}
