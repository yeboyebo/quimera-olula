export type Modelo = {
  [clave: string]: unknown;
};

export type Entidad = {
  id: string;
  [clave: string]: unknown;
};

export type EntidadAccion = {
  id: string;
}

export type Criteria = {
  filtros: Filtro;
  orden: Orden;
  paginacion?: Paginacion;
}

export type Orden = string[];
type ClausulaFiltro = [string, string, string?];
export type Filtro = ClausulaFiltro[];
// export type Filtro = (
//   [string, string] |
//   [string, string, string] |
//   [string, string, string][]
// );
export type Paginacion = {
  limite: number;
  pagina: number;
};

export type TotalRegistros = number;

export type RespuestaLista<T> = Promise<{
  datos: T[];
  total: TotalRegistros;
}>

export type RespuestaLista2<T> = {
  datos: T[];
  total: TotalRegistros;
}

export type Direccion = {
  nombre_via: string;
  tipo_via: string;
  numero: string;
  otros: string;
  cod_postal: string;
  ciudad: string;
  provincia_id: number;
  provincia: string;
  pais_id: string;
  apartado: string;
  telefono: string;
};


export type EmitirEvento = (evento: string, payload?: unknown) => void

export type TipoInput =
  | "texto"
  | "numero"
  | "fecha"
  | "hora"
  | "contraseña"
  | "email"
  | "checkbox"
  | "radio"
  | "telefono"
  | "color"
  | "fichero"
  | "url"
  | "rango"
  | "moneda";

export type ListaSeleccionable<E extends Entidad> = {
  lista: E[];
  idActivo: string | null;
}