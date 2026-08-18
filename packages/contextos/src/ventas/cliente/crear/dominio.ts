import { camposIdFiscal } from "#/ventas/comun/componentes/moleculas/CambiarIdFiscal/dominio.ts";
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
        ...camposIdFiscal<NuevoCliente>(),
    }
};
