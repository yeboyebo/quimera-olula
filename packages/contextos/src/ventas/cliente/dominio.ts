import { idFiscalValido, tipoIdFiscalValido } from "../../valores/idfiscal.ts";

export const idFiscalValidoGeneral = (tipo: string, valor: string) => {
    return idFiscalValido(tipo)(valor) && tipoIdFiscalValido(tipo) === true;
}
