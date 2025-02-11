import { PropsWithChildren, useState } from "react";
import { Contexto } from "../../contextos/comun/contexto.ts";
import { Entidad } from "../../contextos/comun/diseño.ts";
import { Plantilla } from "../plantilla/Plantilla.tsx";
import { Slot } from "../slot/Slot.tsx";

export const Vista = <T extends Entidad>({
  children,
}: PropsWithChildren<object>) => {
  const slots = { hijos: children };

  const [entidades, setEntidades] = useState<T[]>([]);
  const [seleccionada, setSeleccionada] = useState<T | null>(null);

  return (
    <Contexto.Provider
      value={{
        entidades,
        setEntidades: setEntidades as (entidades: Entidad[]) => void,
        seleccionada,
        setSeleccionada: setSeleccionada as (
          seleccionada: Entidad | null
        ) => void,
      }}
    >
      <Slot nombre="contenido" {...slots}>
        <Plantilla>{children}</Plantilla>
      </Slot>
    </Contexto.Provider>
  );
};
