import { MetaTabla } from "@olula/componentes/index.js";
import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { ModLin } from "../diseño.js";

export type EstadoMaestroModLin = 'INICIAL';

export type ContextoMaestroModLin = {
    estado: EstadoMaestroModLin;
    modLins: ListaActivaEntidades<ModLin>;
};

export const metaTablaModLin: MetaTabla<ModLin> = [
    { id: 'id', cabecera: 'ID' },
    { id: 'campoString', cabecera: 'Campo String' },
];
