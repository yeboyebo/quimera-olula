import { MetaModelo } from "@olula/lib/dominio.js";
import { CierreArqueoTpv } from "../diseño.ts";



export const metaCierreArqueoTpv: MetaModelo<CierreArqueoTpv> = {
    campos: {
        idAgenteCierre: { requerido: true, },
        movimientoCierre: { requerido: true, tipo: "moneda" },
    },
};

export const cierreArqueoTpvVacio: CierreArqueoTpv = {
    idAgenteCierre: "",
    movimientoCierre: 0
};