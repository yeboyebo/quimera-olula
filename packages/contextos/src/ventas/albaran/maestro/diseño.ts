import { Albaran } from "../diseño.ts";

export type EstadoMaestroAlbaran = (
    'INICIAL' | 'CREANDO_ALBARAN'
);

export type ContextoMaestroAlbaran = {
    estado: EstadoMaestroAlbaran,
    albaranes: Albaran[];
    albaranActivo: Albaran | null;
    totalAlbaranes: number;
};
