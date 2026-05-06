import { Entidad, Filtro, Orden, Paginacion, RespuestaLista } from "@olula/lib/diseño.ts";

/**
 * Interfaz principal del Módulo
 * Representa un módulo del sistema
 */
export interface Modulo extends Entidad {
    id: string;
    nombre: string;
    descripcion: string;
    estado: 'activo' | 'inactivo';
    fecha_creacion: Date;
}

/**
 * Interfaz para respuesta de API (puede ser diferente a Modulo)
 */
export interface ModuloAPI {
    id: string;
    nombre: string;
    descripcion: string;
    estado: string;
    fecha_creacion: string;
}

/**
 * Tipo para crear nuevo módulo (sin id)
 */
export interface NuevoModulo {
    nombre: string;
    descripcion: string;
    estado: 'activo' | 'inactivo';
    fecha_creacion: Date;
}

/**
 * Tipos de funciones para infraestructura (contratos)
 */
export type GetModulo = (id: string) => Promise<Modulo>;

export type GetModulos = (
    filtro: Filtro,
    orden: Orden,
    paginacion: Paginacion
) => Promise<RespuestaLista<Modulo>>;

export type PostModulo = (modulo: NuevoModulo) => Promise<string>;

export type PatchModulo = (id: string, modulo: Partial<Modulo>) => Promise<void>;

export type DeleteModulo = (id: string) => Promise<void>;
