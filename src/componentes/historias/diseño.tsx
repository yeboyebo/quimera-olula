import { ReactNode } from "react";

export type HistoriasComponente = {
  default: MetaHistorias;
} & {
  [key: string]: Historia;
};

export type Historia = AtributosHistoria | Historia[];

export type ComponenteHistoria = (_: Record<string, unknown>) => ReactNode;
export type AtributosHistoria = Record<string, string>;

export interface MetaHistorias {
  grupo: string;
  titulo: string;
  Componente: ComponenteHistoria;
  attrs?: AtributosHistoria;
}
