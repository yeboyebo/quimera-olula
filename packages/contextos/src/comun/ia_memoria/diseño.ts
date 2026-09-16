import { Criteria, Entidad, Modelo, RespuestaLista } from "@olula/lib/diseño.ts";

/**
 * Origen del contenido de una memoria: texto escrito a mano, o extraído de
 * un fichero subido/importado (ver NuevaIaMemoriaDesdeFichero).
 */
export type OrigenIaMemoria = "texto" | "fichero";

/**
 * Interfaz principal de IaMemoria.
 * Representa un fragmento de contexto de negocio que el asistente de IA
 * del backend usa como memoria persistente.
 */
export interface IaMemoria extends Entidad {
    id: string;
    titulo: string;
    contenido: string;
    activo: boolean;
    origen: OrigenIaMemoria;
    /** Solo cuando origen === "fichero": nombre del fichero original subido/importado. */
    nombreFichero?: string;
    /** Solo cuando origen === "fichero": id del documento persistido (comandos/documental/documento) para descarga/reemplazo. */
    documentoId?: string;
    creadoPor: string;
    creadoEn: Date;
    actualizadoEn: Date;
    /** Tiene al menos un chunk generado en ia_memoria_chunk (RAG). */
    indexado: boolean;
    /** Fecha del chunk más reciente, o undefined si `indexado` es false. */
    indexadoEn?: Date;
    /** Algún chunk se generó con un modelo de embeddings distinto al activo ahora
     * (p. ej. tras cambiar de modelo) — conviene reindexar (reemplazar fichero, o
     * guardar de nuevo si es texto) para que vuelva a ser buscable con garantías. */
    modeloDesactualizado: boolean;
}

/**
 * Tipo para crear una nueva memoria de texto manual (sin campos calculados en el servidor).
 */
export interface NuevaIaMemoria extends Modelo {
    titulo: string;
    contenido: string;
}

/**
 * Tipo para crear (o reemplazar el fichero de) una memoria a partir de un fichero subido/importado.
 * El backend extrae el texto del fichero y lo persiste en `contenido`.
 */
export interface NuevaIaMemoriaDesdeFichero {
    titulo?: string;
    nombreFichero: string;
    tipoMime: string;
    contenidoBase64: string;
}

/**
 * Tipo para cambiar una memoria existente.
 */
export type CambiosIaMemoria = Partial<IaMemoria>;

/**
 * Tipos de funciones para infraestructura (contratos)
 */
export type GetIaMemoria = (id: string) => Promise<IaMemoria>;

export type GetIaMemorias = (criteria: Criteria) => RespuestaLista<IaMemoria>;

export type PostIaMemoria = (nuevaIaMemoria: NuevaIaMemoria) => Promise<string>;

export type PostIaMemoriaDesdeFichero = (nuevaIaMemoria: NuevaIaMemoriaDesdeFichero) => Promise<string>;

export type PatchIaMemoriaDesdeFichero = (id: string, fichero: NuevaIaMemoriaDesdeFichero) => Promise<void>;

export type PatchIaMemoria = (id: string, cambios: CambiosIaMemoria) => Promise<void>;

export type DeleteIaMemoria = (id: string) => Promise<void>;

/** Estado del RAG semántico en este servidor — ver estado-rag en infraestructura.ts. */
export interface EstadoRagIaMemoria {
    disponible: boolean;
}

export type GetEstadoRagIaMemoria = () => Promise<EstadoRagIaMemoria>;
