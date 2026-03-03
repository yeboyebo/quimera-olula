import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { Albaran } from "../diseño.ts";

export type EstadoMaestroAlbaran = (
    'INICIAL' | 'CREANDO_ALBARAN'
);

export type ContextoMaestroAlbaran = {
    estado: EstadoMaestroAlbaran;
    albaranes: ListaActivaEntidades<Albaran>;
};
