import { Criteria, Entidad, RespuestaLista } from "@olula/lib/diseño.ts";

export interface AgenteTpv extends Entidad {
    id: string;
    nombre: string;
};

export type GetAgentesTpv = (criteria: Criteria) => RespuestaLista<AgenteTpv>;
