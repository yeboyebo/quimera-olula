import { Direccion } from "../../comun/diseño.ts";
import {
    initEstadoModelo,
    // makeValidador,
    MetaModelo,
    modeloEsEditable,
    modeloEsValido,
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
    fecha_salida: '',
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
    // validador: makeValidador({}),
    campos: {
        cliente_id: { requerido: true },
        direccion_id: { requerido: true },
        empresa_id: { requerido: true },
    }
};

export const metaCambioCliente: MetaModelo<CambioCliente> = {
    // validador: makeValidador({}),
    campos: {
        cliente_id: { requerido: true },
        direccion_id: { requerido: true },
    }
};

export const metaPresupuesto: MetaModelo<Presupuesto> = {
    campos: {
        fecha: { tipo: "fecha", requerido: false },
        fecha_salida: { tipo: "fecha", requerido: false },
        tasa_conversion: { tipo: "numero", requerido: true },
        total_divisa_empresa: { tipo: "numero", bloqueado: true },
        codigo: { bloqueado: true },
        id_fiscal: { bloqueado: true, requerido: true },
        cliente_id: { bloqueado: true, requerido: true },
        divisa_id: { requerido: true },
    },
    editable: (presupuesto: Presupuesto, _?: string) => {
        return !presupuesto.aprobado;
    },
};

export const editable = modeloEsEditable<Presupuesto>(metaPresupuesto);
export const presupuestoValido = modeloEsValido<Presupuesto>(metaPresupuesto);


export const metaLinea: MetaModelo<LineaPresupuesto> = {
    campos: {
        cantidad: { tipo: "numero", requerido: true },
        referencia: { requerido: true },
    }
};

export const metaNuevaLinea: MetaModelo<NuevaLinea> = {
    campos: {
        cantidad: { tipo: "numero", requerido: true },
        referencia: { requerido: true },
    }
};

export const initEstadoPresupuestoVacio = () => {
    return initEstadoModelo(presupuestoVacio());
    // return initEstadoModelo(presupuestoVacio(), metaPresupuesto);
};



