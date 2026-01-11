import { MetaTabla } from "@olula/componentes/index.js";
import { ArqueoTpv } from "../../diseño.ts";

export type EstadoMaestroArqueosTpv = (
    'INICIAL'
);

export type ContextoMaestroArqueosTpv = {
    estado: EstadoMaestroArqueosTpv;
    arqueos: ArqueoTpv[];
    totalArqueos: number;
    arqueoActivo: ArqueoTpv | null;
};

export const metaTablaArqueo: MetaTabla<ArqueoTpv> = [
    {
        id: "id",
        cabecera: "Código",
    },
    {
        id: "fechahora_inicio",
        cabecera: "Apertura",
        tipo: "fechahora",
    },
    {
        id: "abierto",
        cabecera: "Abierto",
    },
];