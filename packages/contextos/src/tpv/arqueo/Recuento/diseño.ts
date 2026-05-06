import { MetaCampo, MetaModelo } from "@olula/lib/dominio.js"

export type RecuentoArqueoTpv = {
    id: string,
    b500: number
    b200: number
    b100: number
    b50: number
    b20: number
    b10: number
    b5: number
    m2: number
    m1: number
    m050: number
    m020: number
    m010: number
    m005: number
    m002: number
    m001: number
    // recuentoEfectivo: number,
    recuentoTarjeta: number,
    recuentoVales: number
}
const metaCampoMoneda: MetaCampo<RecuentoArqueoTpv> = { requerido: true, tipo: "numero", positivo: true };

export const metaRecuentoArqueoTpv: MetaModelo<RecuentoArqueoTpv> = {

    campos: {
        id: { requerido: true },
        b500: metaCampoMoneda,
        b200: metaCampoMoneda,
        b100: metaCampoMoneda,
        b50: metaCampoMoneda,
        b20: metaCampoMoneda,
        b10: metaCampoMoneda,
        b5: metaCampoMoneda,
        m2: metaCampoMoneda,
        m1: metaCampoMoneda,
        m050: metaCampoMoneda,
        m020: metaCampoMoneda,
        m010: metaCampoMoneda,
        m005: metaCampoMoneda,
        m002: metaCampoMoneda,
        m001: metaCampoMoneda,
        recuentoTarjeta: { requerido: true, tipo: "moneda" },
        recuentoVales: { requerido: true, tipo: "moneda" },
    },
};

export const recuentoArqueoTpvInicial: RecuentoArqueoTpv = {
    id: "",
    b500: 0,
    b200: 0,
    b100: 0,
    b50: 0,
    b20: 0,
    b10: 0,
    b5: 0,
    m2: 0,
    m1: 0,
    m050: 0,
    m020: 0,
    m010: 0,
    m005: 0,
    m002: 0,
    m001: 0,
    // recuentoEfectivo: 0,
    recuentoTarjeta: 0,
    recuentoVales: 0
};

