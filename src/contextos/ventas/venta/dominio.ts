import { MetaModelo } from "../../comun/dominio.ts";
import { direccionVacia } from "../presupuesto/dominio.ts";
import { CambioClienteVenta, LineaVenta, NuevaLineaVenta, NuevaVenta, Venta } from "./diseño.ts";

export const ventaVacia: Venta = {
    id: '',
    codigo: '',
    fecha: '',
    cliente_id: '',
    nombre_cliente: '',
    id_fiscal: '',
    direccion_id: '',
    direccion: direccionVacia(),
    agente_id: '',
    nombre_agente: '',
    divisa_id: '',
    tasa_conversion: 1,
    aprobado: false,
    total: 0,
    total_divisa_empresa: 0,
    neto: 0,
    total_iva: 0,
    total_irpf: 0,
    forma_pago_id: '',
    nombre_forma_pago: '',
    grupo_iva_negocio_id: '',
    observaciones: '',
}

export const nuevaVentaVacia: NuevaVenta = {
    cliente_id: "",
    direccion_id: "",
    empresa_id: "1",
}

export const cambioClienteVentaVacio: CambioClienteVenta = {
    cliente_id: "",
    nombre_cliente: "",
    direccion_id: "",
}
export const nuevaLineaVentaVacia: NuevaLineaVenta = {
    referencia: "",
    cantidad: 1,
};

export const metaVenta: MetaModelo<Venta> = {
    campos: {
        tasa_conversion: { tipo: "numero", requerido: true },
        total_divisa_empresa: { tipo: "numero", bloqueado: true },
        codigo: { bloqueado: true },
        id_fiscal: { bloqueado: true, requerido: true },
        cliente_id: { bloqueado: true, requerido: true },
        divisa_id: { requerido: true },
    },
};

export const metaLineaVenta: MetaModelo<LineaVenta> = {
    campos: {
        cantidad: { tipo: "numero", requerido: true },
        referencia: { requerido: true },
    }
};

export const metaNuevaVenta: MetaModelo<NuevaVenta> = {
    campos: {
        cliente_id: { requerido: true },
        direccion_id: { requerido: true },
        empresa_id: { requerido: true },
    }
};

export const metaCambioClienteVenta: MetaModelo<CambioClienteVenta> = {
    campos: {
        cliente_id: { requerido: true },
        direccion_id: { requerido: true },
    }
};

export const metaNuevaLineaVenta: MetaModelo<NuevaLineaVenta> = {
    campos: {
        cantidad: { tipo: "numero", requerido: true },
        referencia: { requerido: true },
    }
};
