import { MetaTabla } from "@olula/componentes/index.js";
import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { CabeceraArqueoTpv } from "../diseño.ts";

export type EstadoMaestroArqueosTpv = (
    'INICIAL'
);

export type ContextoMaestroArqueosTpv = {
    estado: EstadoMaestroArqueosTpv;
    arqueos: ListaActivaEntidades<CabeceraArqueoTpv>
};

export const metaTablaArqueo: MetaTabla<CabeceraArqueoTpv> = [
    {
        id: "id",
        cabecera: "Código",
    },
    {
        id: "fechahoraApertura",
        cabecera: "Apertura",
        tipo: "fechahora",
    },
    {
        id: "abierto",
        cabecera: "Abierto",
        tipo: "booleano"
    },
];