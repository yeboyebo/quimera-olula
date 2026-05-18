import { Entidad, Filtro, Orden, Paginacion, RespuestaLista } from "@olula/lib/diseño.js";

export type EstadoJornada = 'BORRADOR' | 'APROBADA' | 'ANULADA';
export type EstadoBorradorJornada = 'ACTIVA' | 'PAUSADA' | "CERRADA" | null;

export interface PausaJornada extends Entidad {
    id: string;
    horaInicio: string;
    horaFin: string | null;
    causa: string;
}

export interface RegistroJornada extends Entidad {
    id: string;
    empleadoId: string;
    fecha: Date;
    horaEntrada: string | null;
    horaSalida: string | null;
    estado: EstadoJornada;
    observaciones: string | null;
    tiempoTotalPausas: number;
    estadoBorrador: EstadoBorradorJornada;
    pausas: PausaJornada[];
}

export type NuevaJornada = {
    empleadoId: string;
    fecha: string;
    horaEntrada: string | null;
    horaSalida: string | null;
    observaciones: string | null;
};

export type CambiosJornada = {
    horaEntrada: string | null;
    horaSalida: string | null;
    observaciones: string | null;
};

export type AnulacionJornada = {
    motivo: string | null;
};

export type NuevaPausa = {
    horaInicio: string;
    causa: string;
};

export type ReactivacionJornada = {
    horaFin: string;
};

export type GetJornadas = (filtro: Filtro, orden: Orden, paginacion: Paginacion) => RespuestaLista<RegistroJornada>;
export type GetJornada = (id: string) => Promise<RegistroJornada>;
export type PostJornada = (jornada: NuevaJornada) => Promise<string>;
export type PatchJornada = (id: string, cambios: CambiosJornada) => Promise<void>;
export type PatchAprobarJornada = (id: string) => Promise<void>;
export type PatchAnularJornada = (id: string, anulacion: AnulacionJornada) => Promise<void>;
export type PatchPausarJornada = (id: string, pausa: NuevaPausa) => Promise<void>;
export type PatchReactivarJornada = (id: string, reactivacion: ReactivacionJornada) => Promise<void>;
