import { Albaran, LineaAlbaran } from "../diseño.ts";

export type EstadoAlbaran = (
    'INICIAL' | "ABIERTO" | "FACTURADO"
    | "BORRANDO_ALBARAN"
    | "CAMBIANDO_CLIENTE"
    | "CAMBIANDO_DESCUENTO"
    | "CREANDO_LINEA" | "BORRANDO_LINEA" | "CAMBIANDO_LINEA"
);

export type ContextoAlbaran = {
    estado: EstadoAlbaran,
    albaran: Albaran;
    albaranInicial: Albaran;
    lineaActiva: LineaAlbaran | null;
};
