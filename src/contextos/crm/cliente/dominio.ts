import { EstadoModelo, initEstadoModelo, MetaModelo } from "../../comun/dominio.ts";
import { idFiscalValido, tipoIdFiscalValido } from "../../valores/idfiscal.ts";
import { NuevaOportunidadVenta } from "../oportunidadventa/diseño.ts";
import { Cliente } from "./diseño.ts";



export const idFiscalValidoGeneral = (tipo: string, valor: string) => {
    return idFiscalValido(tipo)(valor) && tipoIdFiscalValido(tipo) === true;
}

export const clienteVacio = (): Cliente => ({
    id: '',
    nombre: '',
    nombre_comercial: null,
    id_fiscal: '',
    tipo_id_fiscal: '',
    grupo_iva_negocio_id: '',
    grupo_id: '',
    telefono1: '',
    telefono2: '',
    email: '',
    web: '',
    observaciones: '',
    contacto_id: '',
})


export const initEstadoCliente = (cliente: Cliente): EstadoModelo<Cliente> => {
    return initEstadoModelo(cliente);
}


export const metaCliente: MetaModelo<Cliente> = {
    campos: {
        nombre: { requerido: true },
        id_fiscal: {
            requerido: true,
            validacion: (cliente: Cliente) => idFiscalValido(cliente.tipo_id_fiscal)(cliente.id_fiscal),
        },
        tipo_id_fiscal: {
            requerido: true,
            validacion: (cliente: Cliente) => tipoIdFiscalValido(cliente.tipo_id_fiscal),
        },
        nombre_agente: { bloqueado: true },
        email: { tipo: "email" },
        telefono1: { tipo: "telefono" },
    }
};



export const initEstadoClienteVacio = () => initEstadoCliente(clienteVacio())

export const metaNuevaOportunidadVenta: MetaModelo<NuevaOportunidadVenta> = {
    campos: {
        descripcion: { requerido: true },
        probabilidad: { requerido: true },
        estado_id: { requerido: false },
        cliente_id: { requerido: true },
        nombre_cliente: { requerido: true },
    }
};

export const nuevaOportunidadVentaVacia: NuevaOportunidadVenta = {
    descripcion: "",
    probabilidad: "",
    valor_defecto: false,
    estado_id: undefined,
    cliente_id: "",
    nombre_cliente: "",
};


