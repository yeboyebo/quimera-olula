import { Entidad, Filtro, Modelo, Orden, Paginacion, RespuestaLista } from "@olula/lib/diseño.ts";

/**
 * Interfaz principal del Módulo
 * Representa un módulo del sistema
 */
export type CampoOpcion = 'opcion1' | 'opcion2';
export interface Modulo extends Entidad {
    id: string;
    campoString: string;
    campoTexto: string;
    campoNumero: number;
    campoOpcion: CampoOpcion;
    campoFecha: Date;
}

/**
 * Tipo para crear nuevo módulo (sin id ni otros parámetros que se calculen en el servidor)
 */
export interface NuevoModulo extends Modelo {
    campoString: string;
    campoTexto: string;
    campoNumero: number;
    campoOpcion: CampoOpcion;
    campoFecha: Date;
}

/**
 * Tipo por defecto para cambiar el módulo. Adaptar según necesidades y crear varios si hay distintos tipos de cambio
 */
export type CambiosModulo = Partial<Modulo>;

/**
 * Tipos de funciones para infraestructura (contratos)
 */
export type GetModulo = (id: string) => Promise<Modulo>;

export type GetModulos = (
    filtro: Filtro,
    orden: Orden,
    paginacion: Paginacion
) => RespuestaLista<Modulo>;

export type PostModulo = (nuevoModulo: NuevoModulo) => Promise<string>;

export type PatchModulo = (id: string, cambios: CambiosModulo) => Promise<void>;

export type DeleteModulo = (id: string) => Promise<void>;
