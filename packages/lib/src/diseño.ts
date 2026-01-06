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
    paginacion: Paginacion;
}

export type ClausulaFiltro = [string, string, string?];
export type Filtro = ClausulaFiltro[];

export type Orden = string[];

export type Paginacion = {
    limite: number;
    pagina: number;
};

export type OpcionCampo = [string, string];

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
    | "fecha_hora"
    | "contraseña"
    | "email"
    | "checkbox"
    | "radio"
    | "telefono"
    | "color"
    | "fichero"
    | "url"
    | "rango"
    | "moneda"
    | "autocompletar"
    | "selector";


export type ListaSeleccionable<E extends Entidad> = {
    lista: E[];
    idActivo: string | null;
}

type ContextoEstado<E extends string> = {
    estado: E;
}
export type EventoMaquina = [string, unknown?]


export type Contexto<E extends string> = Record<string, unknown> & ContextoEstado<E>


export type ProcesarContexto<E extends string, C extends Contexto<E>> = (contexto: C, payload?: unknown) => Promise<C | [C, EventoMaquina[]]>;

export type Maquina<E extends string, C extends Contexto<E>> =
    Record<E, Record<string, E | ProcesarContexto<E, C> | (E | ProcesarContexto<E, C>)[]>>