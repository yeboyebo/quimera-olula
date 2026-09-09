import { Criteria, Entidad, Modelo, RespuestaLista } from "@olula/lib/diseño.ts";

/**
 * Interfaz principal de IaTareaProgramada: una programación tipo cron que
 * dispara la ejecución (sin supervisión humana) de un flujo de trabajo de IA
 * (ver ../ia_flujo). El backend bloquea cualquier acción de escritura que el
 * flujo intente hasta que un humano la confirme desde el chat — ver historial
 * de ejecuciones en la tab correspondiente del detalle.
 */
export interface IaTareaProgramada extends Entidad {
    id: string;
    nombre: string;
    iaFlujoId: string;
    expresionCron: string;
    activo: boolean;
    proximaEjecucion: Date;
    usuarioId: string;
    /**
     * Credenciales de comun/credencial_externa que esta tarea puede usar —
     * necesario para desambiguar cuando hay más de una credencial del mismo
     * proveedor (dos cuentas de Telegram, dos buzones de correo...). Vacío =
     * sin restricción explícita (comportamiento previo a este campo).
     */
    credencialIds: string[];
}

/**
 * Tipo para crear una nueva tarea programada.
 */
export interface NuevoIaTareaProgramada extends Modelo {
    nombre: string;
    iaFlujoId: string;
    expresionCron: string;
    activo: boolean;
    credencialIds: string[];
}

/**
 * Tipo para cambiar una tarea programada existente.
 */
export type CambiosIaTareaProgramada = Partial<IaTareaProgramada>;

/**
 * Estado de una ejecución pasada (historial de auditoría).
 */
export type EstadoEjecucionIaTareaProgramada = "ok" | "bloqueada" | "error";

export interface EjecucionIaTareaProgramada {
    id: number;
    tareaId: string;
    timestamp: Date;
    estado: EstadoEjecucionIaTareaProgramada;
    resumen: string | null;
    threadId: string | null;
}

/**
 * Tipos de funciones para infraestructura (contratos)
 */
export type GetIaTareaProgramada = (id: string) => Promise<IaTareaProgramada>;

export type GetIaTareasProgramadas = (criteria: Criteria) => RespuestaLista<IaTareaProgramada>;

export type PostIaTareaProgramada = (nuevaTarea: NuevoIaTareaProgramada) => Promise<string>;

export type PatchIaTareaProgramada = (id: string, cambios: CambiosIaTareaProgramada) => Promise<void>;

export type DeleteIaTareaProgramada = (id: string) => Promise<void>;

export type GetEjecucionesIaTareaProgramada = (tareaId: string) => Promise<EjecucionIaTareaProgramada[]>;
