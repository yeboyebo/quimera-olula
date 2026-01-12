import { MetaModelo } from "@olula/lib/dominio.js";
import { ArqueoTpv } from "../../diseño.ts";

export const metaArqueoTpv: MetaModelo<ArqueoTpv> = {
    campos: {},
};

export const arqueoTpvVacio: ArqueoTpv = {
    id: "",
    fechahoraApertura: new Date(),
    idAgenteApertura: "",
    fechahoraCierre: null,
    idAgenteCierre: null,
    abierto: false,
    pagosEfectivo: 0,
    pagosTarjeta: 0,
    pagosVale: 0,
    recuentoEfectivo: 0,
    recuentoTarjeta: 0,
    recuentoVales: 0,
    movimientoCierre: 0
};

export type EstadoArqueoTpv = (
    'INICIAL' | "ABIERTO" | "CERRADO"
    | "BORRANDO_ARQUEO" | "RECONTANDO" | "CERRANDO"
    | "REABRIENDO"
);


export type ContextoArqueoTpv = {
    estado: EstadoArqueoTpv,
    arqueo: ArqueoTpv;
    arqueoInicial: ArqueoTpv;
    // pagoActivo: PagoVentaTpv | null;
};

export type CierreArqueoTpv = {
    idAgenteCierre: string,
    movimientoCierre: number
}

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
