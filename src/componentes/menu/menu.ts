
export interface ElementoMenuPadre {
  nombre: string;
  icono?: string;
  subelementos: ElementoMenu[];
  regla?: string;
}

export interface ElementoMenuHijo {
  nombre: string;
  icono?: string;
  url: string;
  regla?: string;
}

export type ElementoMenu = ElementoMenuPadre | ElementoMenuHijo;
