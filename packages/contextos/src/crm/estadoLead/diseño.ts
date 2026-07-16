import { Entidad } from "@olula/lib/diseño.ts";

export interface EstadoLead extends Entidad {
    id: string;
    descripcion: string;
    valorDefecto: boolean;
};