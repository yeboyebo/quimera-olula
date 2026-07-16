import { Entidad } from "@olula/lib/diseño.ts";

export interface EstadoOportunidad extends Entidad {
    id: string;
    estadobase: string;
    descripcion: string;
    probabilidad: number;
    valorDefecto: boolean;
};