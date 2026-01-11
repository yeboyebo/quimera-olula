import { MetaModelo } from "@olula/lib/dominio.js";
import { ArqueoTpv } from "../../diseño.ts";

export const metaArqueoTpv: MetaModelo<ArqueoTpv> = {
    campos: {

    },
};

export const arqueoTpvVacio: ArqueoTpv = {
    id: "",
    fechahora_inicio: new Date(),
    fechahora_fin: null,
    abierto: false
};

export type EstadoArqueoTpv = (
    'INICIAL' | "ABIERTO" | "CERRADO"
    | "BORRANDO_ARQUEO" | "RECONTANDO" | "CERRANDO"
);


export type ContextoArqueoTpv = {
    estado: EstadoArqueoTpv,
    arqueo: ArqueoTpv;
    arqueoInicial: ArqueoTpv;
    // pagoActivo: PagoVentaTpv | null;
};
