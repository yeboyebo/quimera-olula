import { Entidad } from "@olula/lib/diseño.ts";

export interface EstadoOportunidad extends Entidad {
    id: string;
    descripcion: string;
    probabilidad: number;
    valor_defecto: boolean;
};