import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.ts";
import { FacturaCreada } from "../../factura/diseño.ts";
import { Albaran } from "../diseño.ts";

export type EstadoMaestroAlbaran =
    | 'INICIAL'
    | 'CREANDO'
    | 'FACTURANDO'
    | 'FACTURA_CREADA';

export type ContextoMaestroAlbaran = {
    estado: EstadoMaestroAlbaran;
    albaranes: ListaActivaEntidades<Albaran>;
    seleccionados: string[];
    facturaCreada: FacturaCreada | null;
};
