import { EstadoModelo, initEstadoModelo, MetaModelo, stringNoVacio } from "../../comun/dominio.ts";
import { idFiscalValido, tipoIdFiscalValido } from "../../valores/idfiscal.ts";
import { Cliente, CrmContacto, CuentaBanco, DirCliente, FormBaja, NuevaCuentaBanco, NuevaDireccion, NuevoCliente, NuevoCrmContacto } from "./diseño.ts";



export const idFiscalValidoGeneral = (tipo: string, valor: string) => {
    return idFiscalValido(tipo)(valor) && tipoIdFiscalValido(tipo) === true;
}

export const puedoMarcarDireccionFacturacion = (direccion: DirCliente) => {
    return !direccion.dir_facturacion;
}


export const clienteVacio = (): Cliente => ({
    id: '',
    nombre: '',
    nombre_comercial: null,
    id_fiscal: '',
    agente_id: null,
    nombre_agente: null,
    divisa_id: '',
    tipo_id_fiscal: '',
    serie_id: '',
    forma_pago_id: '',
    grupo_iva_negocio_id: '',
    de_baja: false,
    fecha_baja: null,
    grupo_id: '',
    telefono1: '',
    telefono2: '',
    email: '',
    web: '',
    observaciones: '',
    copiasfactura: 0,
    fechabaja: '',
    contacto_id: '',
    cuenta_domiciliada: '',
    descripcion_cuenta: '',
    debaja: false,
    forma_pago: '',
    divisa: '',
    grupo_iva_negocio: '',
    serie: '',
    grupo: '',
})

export const nuevoClienteVacio: NuevoCliente = {
    nombre: '',
    id_fiscal: '',
    empresa_id: '1',
    tipo_id_fiscal: '',
    agente_id: '',
}

export const nuevaDireccionVacia: NuevaDireccion = {
    nombre_via: '',
    tipo_via: '',
    ciudad: '',
}

export const nuevaCuentaBancoVacia: NuevaCuentaBanco = {
    descripcion: '',
    iban: '',
    bic: '',
}

export const nuevoCrmContactoVacio: NuevoCrmContacto = {
    nombre: '',
    email: '',
}

export const validadoresDireccion = {
    nuevaDireccion: (valor: NuevaDireccion) => (
        validadoresDireccion.tipo_via(valor.tipo_via) &&
        validadoresDireccion.nombre_via(valor.nombre_via) &&
        validadoresDireccion.ciudad(valor.ciudad)
    ),
    tipo_via: (valor: string) => stringNoVacio(valor),
    nombre_via: (valor: string) => stringNoVacio(valor),
    ciudad: (valor: string) => stringNoVacio(valor),
}

export const validadoresCliente = {
    nombre: (valor: string) => stringNoVacio(valor),
    id_fiscal: (valor: string) => stringNoVacio(valor),
    nuevoCliente: (cliente: NuevoCliente) =>
        cliente.nombre && cliente.id_fiscal,
};


export const initEstadoCliente = (cliente: Cliente): EstadoModelo<Cliente> => {
    return initEstadoModelo(cliente);
}

export const initEstadoDireccion = (direccion: DirCliente): EstadoModelo<DirCliente> => {
    return initEstadoModelo(direccion);
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
        fecha_baja: { tipo: "fecha" },
        telefono1: { tipo: "telefono" },
    }
};


export const metaNuevoCliente: MetaModelo<NuevoCliente> = {
    campos: {
        nombre: { requerido: true },
        tipo_id_fiscal: { requerido: true },
        id_fiscal: { requerido: true },
    }
};

export const metaDireccion: MetaModelo<DirCliente> = {
    campos: {
        tipo_via: { requerido: true },
        nombre_via: { requerido: true },
        ciudad: { requerido: true },
    }
};

export const metaNuevaDireccion: MetaModelo<NuevaDireccion> = {
    campos: {
        nombre_via: { requerido: true },
        ciudad: { requerido: true },
    }
};

export const metaCuentaBanco: MetaModelo<CuentaBanco> = {
    campos: {
        iban: { requerido: true },
        bic: { requerido: true },
    }
};

export const metaNuevaCuentaBanco: MetaModelo<NuevaCuentaBanco> = {
    campos: {
        cuenta: { requerido: true },
    }
};

export const metaCrmContacto: MetaModelo<CrmContacto> = {
    campos: {
        nombre: { requerido: true },
        email: { requerido: true, tipo: "email" },
    }
};

export const metaNuevoCrmContacto: MetaModelo<NuevoCrmContacto> = {
    campos: {
        nombre: { requerido: true },
        email: { requerido: true, tipo: "email" },
    }
};

export const metaDarDeBaja: MetaModelo<FormBaja> = {
    campos: {
        fecha_baja: { requerido: true, tipo: "fecha" },
    }
};


export const initEstadoClienteVacio = () => initEstadoCliente(clienteVacio())


