import { MetaTabla } from "@olula/componentes/index.js";
import { ReciboVenta } from "../diseño.js";

export const metaTablaReciboVenta: MetaTabla<ReciboVenta> = [
    { id: 'codigo', cabecera: 'Código' },
    { id: 'nombreCliente', cabecera: 'Cliente' },
    { id: 'idFiscal', cabecera: 'ID Fiscal' },
    { id: 'fechaEmision', cabecera: 'F. Emisión', tipo: 'fecha' },
    { id: 'fechaVencimiento', cabecera: 'F. Vencimiento', tipo: 'fecha' },
    { id: 'estado', cabecera: 'Estado' },
    { id: 'importe', cabecera: 'Importe', tipo: 'moneda' },
];
