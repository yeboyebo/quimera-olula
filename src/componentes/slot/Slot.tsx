import {
  PropsWithChildren,
  ReactElement,
  ReactNode,
  isValidElement,
} from "react";

declare module "react" {
  interface Attributes {
    slot?: string;
  }
}

const elementoConSlot = (
  elemento: ReactNode,
  nombre: string
): ReactElement | undefined => {
  if (!elemento) return;

  if (Array.isArray(elemento)) {
    return elemento.find((hijo) => elementoConSlot(hijo, nombre));
  }

  const valido = isValidElement(elemento);
  if (!valido) return;

  const slot = (elemento.props as React.Attributes)?.slot ?? "";
  if (slot !== nombre) return;

  return elemento;
};

type SlotProps = {
  nombre?: string;
  requerido?: boolean;
  hijos: ReactNode;
};

export const Slot = ({
  nombre = "",
  requerido = false,
  hijos,
  children,
}: PropsWithChildren<SlotProps>) => {
  const contenido = elementoConSlot(hijos, nombre);
  if (contenido) return contenido;

  if (requerido) {
    throw new Error(`Slot "${nombre || "porDefecto"}" es requerido`);
  }

  return children;
};
