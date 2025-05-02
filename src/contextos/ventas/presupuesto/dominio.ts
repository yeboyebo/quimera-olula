import { Direccion } from "../../comun/diseño.ts";
import {
    initEstadoModelo,
    makeValidador,
    MetaModelo,
    stringNoVacio
} from "../../comun/dominio.ts";
import { CambioCliente, LineaPresupuesto, NuevaLinea, NuevoPresupuesto, Presupuesto } from "./diseño.ts";


export const direccionVacia = (): Direccion => ({
    nombre_via: "",
    tipo_via: "",
    numero: "",
    otros: "",
    cod_postal: "",
    ciudad: "",
    provincia_id: 0,
    provincia: "",
    pais_id: "",
    apartado: "",
    telefono: "",
});

export const presupuestoVacio = (): Presupuesto => ({
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
})

export const presupuestoNuevoVacio = (): NuevoPresupuesto => ({
    cliente_id: "",
    direccion_id: "",
    empresa_id: "1",
});

export const cambioClienteVacio = (): CambioCliente => ({
    cliente_id: "",
    nombre_cliente: "",
    direccion_id: "",
});

export const nuevaLineaVacia = (): NuevaLinea => ({
    referencia: "",
    cantidad: 1,
});

export const validadoresPresupuesto = {
    cliente_id: (valor: string) => stringNoVacio(valor),
    direccion_id: (valor: string) => stringNoVacio(valor),
    empresa_id: (valor: string) => stringNoVacio(valor),
};

export const metaNuevoPresupuesto: MetaModelo<NuevoPresupuesto> = {
    bloqueados: [],
    requeridos: ["cliente_id", "direccion_id", "empresa_id"],
    validador: makeValidador({}),
};

export const metaCambioCliente: MetaModelo<CambioCliente> = {
    bloqueados: [],
    requeridos: ["cliente_id", "direccion_id"],
    validador: makeValidador({}),
};

export const metaPresupuesto: MetaModelo<Presupuesto> = {
    bloqueados: ["codigo", "id_fiscal", "cliente_id", 'total_divisa_empresa'],
    requeridos: ["cliente_id", "id_fiscal", "divisa_id"],
    validador: makeValidador({}),
    campos: {
        tasa_conversion: { tipo: "number", requerido: true },
        total_divisa_empresa: { tipo: "number" },
    }
};

export const metaLinea: MetaModelo<LineaPresupuesto> = {
    bloqueados: [],
    requeridos: ["referencia", "cantidad"],
    validador: makeValidador({}),
    campos: {
        cantidad: { tipo: "number", requerido: true },
    }
};

export const metaNuevaLinea: MetaModelo<NuevaLinea> = {
    bloqueados: [],
    requeridos: ["referencia", "cantidad"],
    validador: makeValidador({}),
    campos: {
        cantidad: { tipo: "number", requerido: true },
    }
};

export const initEstadoPresupuestoVacio = () => {
    return initEstadoModelo(presupuestoVacio(), metaPresupuesto);
};


