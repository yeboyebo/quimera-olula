import { Criteria, Entidad, RespuestaLista } from "@olula/lib/diseño.ts";

export interface PuntoVentaTpv extends Entidad {
    id: string;
    nombre: string;
};

export type GetPuntosVentaTpv = (criteria: Criteria) => RespuestaLista<PuntoVentaTpv>;
