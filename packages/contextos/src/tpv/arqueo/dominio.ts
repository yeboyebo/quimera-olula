import { formatearMoneda } from "@olula/lib/dominio.js";

const idDivisa = 'EUR';

export const moneda = (v: number) => formatearMoneda(v, idDivisa);