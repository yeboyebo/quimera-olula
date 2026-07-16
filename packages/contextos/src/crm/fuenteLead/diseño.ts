import { Entidad } from "@olula/lib/diseño.ts";

export interface FuenteLead extends Entidad {
    id: string;
    descripcion: string;
    valorDefecto: boolean;
};