import { idFiscalValido, tipoIdFiscalValido } from "#/valores/idfiscal.ts";
import { MetaModelo } from "@olula/lib/dominio.js";
import { NuevoCliente } from "../diseño.ts";

export const nuevoClienteVacio: NuevoCliente = {
    nombre: '',
    id_fiscal: '',
    empresa_id: '1',
    tipo_id_fiscal: '',
    agente_id: '',
}

export const metaNuevoCliente: MetaModelo<NuevoCliente> = {
    campos: {
        nombre: { requerido: true },
        id_fiscal: {
            requerido: true,
            validacion: (cliente: NuevoCliente) => idFiscalValido(cliente.tipo_id_fiscal)(cliente.id_fiscal),
        },
        tipo_id_fiscal: {
            requerido: true,
            validacion: (cliente: NuevoCliente) => tipoIdFiscalValido(cliente.tipo_id_fiscal),
        },
    }
};