import { Remesa } from "./diseño.ts";

export const remesaConPago = (remesa: Remesa): boolean => remesa.pagos.length > 0;

export const remesaPagable = (remesa: Remesa): boolean =>
    !!remesa.id && !remesaConPago(remesa);
