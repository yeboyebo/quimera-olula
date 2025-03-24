import { PropsWithChildren, useState } from "react";
import { Contexto, ContextoSet } from "../../contextos/comun/contexto.ts";
import { Entidad } from "../../contextos/comun/diseño.ts";
import { Plantilla } from "../plantilla/Plantilla.tsx";
import { Slot } from "../slot/Slot.tsx";

export const Vista = ({
  children,
}: PropsWithChildren<object>) => {
  const slots = { hijos: children };

  return (
    
    <>
      <Slot nombre="contenido" {...slots}>
        <Plantilla>{children}</Plantilla>
      </Slot>
    </>
  );
};

export const SubVista = <T extends Entidad>({
  children,
}: PropsWithChildren<object>) => {
  // const slots = { hijos: children };

  const [entidades, setEntidades] = useState<T[]>([]);
  const [seleccionada, setSeleccionada] = useState<T | null>(null);

  return (
    <Contexto.Provider
      value={{
        entidades,
        setEntidades: setEntidades as ContextoSet<Entidad[]>,
        seleccionada,
        setSeleccionada: setSeleccionada as ContextoSet<Entidad | null>,
      }}
    >
      {children}
    </Contexto.Provider>
  );
};
