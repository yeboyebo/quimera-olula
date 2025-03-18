import { PropsWithChildren, useState } from "react";
import { Contexto, ContextoSet } from "../../contextos/comun/contexto.ts";
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
        setEntidades: setEntidades as (_: ContextoSet<Entidad[]>) => void,
        seleccionada,
        setSeleccionada: setSeleccionada as (
          _: ContextoSet<Entidad | null>
        ) => void,
      }}
    >
      <Slot nombre="contenido" {...slots}>
        <Plantilla>{children}</Plantilla>
      </Slot>
    </Contexto.Provider>
  );
};

// ¿Usar param sufijo? ['entidades' + sufijo]: entidades
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
        setEntidades: setEntidades as (_: ContextoSet<Entidad[]>) => void,
        seleccionada,
        setSeleccionada: setSeleccionada as (
          _: ContextoSet<Entidad | null>
        ) => void,
      }}
    >
      {children}
    </Contexto.Provider>
  );
};
