import { MetaTabla } from "@olula/componentes/index.js";
import { ListaEntidades } from "@olula/lib/ListaEntidades.js";
import { ArqueoTpv } from "../diseño.ts";

export type EstadoMaestroArqueosTpv = (
    'INICIAL'
);

// export type ContextoMaestroArqueosTpv = {
//     estado: EstadoMaestroArqueosTpv;
//     arqueos: ArqueoTpv[];
//     totalArqueos: number;
//     arqueoActivo: ArqueoTpv | null;
// };

export type ContextoMaestroArqueosTpv = {
    estado: EstadoMaestroArqueosTpv;
    arqueos: ListaEntidades<ArqueoTpv>
};

export const metaTablaArqueo: MetaTabla<ArqueoTpv> = [
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
    },
];