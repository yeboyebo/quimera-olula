import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.ts";
import { Albaran } from "../diseño.ts";

export type EstadoMaestroAlbaran = 'INICIAL' | 'CREANDO' | 'FACTURANDO';

export type ContextoMaestroAlbaran = {
    estado: EstadoMaestroAlbaran;
    albaranes: ListaActivaEntidades<Albaran>;
    seleccionados: string[];
};
