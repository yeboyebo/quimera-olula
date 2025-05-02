import { EstadoModelo, initEstadoModelo, MetaModelo, modeloEsValido, stringNoVacio } from "../../comun/dominio.ts";
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
    // return initEstadoModelo(cliente, metaCliente);
}

export const initEstadoDireccion = (direccion: DirCliente): EstadoModelo<DirCliente> => {
    return initEstadoModelo(direccion);
    // return initEstadoModelo(direccion, metaDireccion);
}

// const validacionesCliente: ValidadorCampos<Cliente> = {
//     tipo_id_fiscal: (cliente: EstadoModelo<Cliente>): ValidacionCampo => {
//         const valido = tipoIdFiscalValido(cliente.valor.tipo_id_fiscal);
//         return {
//             ...cliente.validacion.tipo_id_fiscal,
//             valido: valido === true,
//             textoValidacion: typeof valido === "string" ? valido : "",
//         }
//     },
//     id_fiscal: (cliente: EstadoModelo<Cliente>): ValidacionCampo => {
//         const tipoValido = tipoIdFiscalValido(cliente.valor.tipo_id_fiscal);
//         const valido = tipoValido
//             ? idFiscalValido(cliente.valor.tipo_id_fiscal)(cliente.valor.id_fiscal)
//             : true;
//         return {
//             ...cliente.validacion.id_fiscal,
//             valido: valido === true,
//             textoValidacion: typeof valido === "string" ? valido : "",
//         }
//     },
//     fecha_baja: (estado: EstadoModelo<Cliente>): ValidacionCampo => {
//         const cliente = estado.valor;
//         const deBajaSinFecha = cliente.de_baja && cliente.fecha_baja === '';
//         const activoConFecha = !cliente.de_baja && cliente.fecha_baja !== '';
//         const invalido = deBajaSinFecha || activoConFecha;
//         return {
//             ...estado.validacion.fecha_baja,
//             valido: !invalido,
//             textoValidacion: deBajaSinFecha
//                 ? "Debe indicar la fecha de baja"
//                 : activoConFecha
//                     ? "No se puede marcar como activo con fecha de baja"
//                     : "",
//         }
//     },
//     fecha_baja_segun_de_baja: (estado: EstadoModelo<Cliente>): ValidacionCampo => {
//         const cliente = estado.valor;
//         // const deBajaSinFecha = cliente.de_baja && cliente.fecha_baja === '';
//         // const activoConFecha = !cliente.de_baja && cliente.fecha_baja !== '';
//         // const invalido = deBajaSinFecha || activoConFecha;
//         return {
//             ...estado.validacion.fecha_baja,
//             bloqueado: !cliente.de_baja,
//             // valido: !invalido,
//             // textoValidacion: deBajaSinFecha
//             //     ? "Debe indicar la fecha de baja"
//             //     : activoConFecha
//             //         ? "No se puede marcar como activo con fecha de baja"
//             //         : "",
//         }
//     },
// }

// const makeValidadorCliente = (validadorCampos: ValidadorCampos<Cliente>) =>

//     (estado: EstadoModelo<Cliente>, campo: string) => {

//         const validacion = estado.validacion;

//         switch (campo) {
//             case "tipo_id_fiscal": {
//                 return {
//                     ...validacion,
//                     tipo_id_fiscal: validarCampo(estado, campo, validadorCampos.tipo_id_fiscal),
//                     id_fiscal: validarCampo(estado, "id_fiscal", validadorCampos.id_fiscal),
//                 };
//             }
//             case "fecha_baja": {
//                 return {
//                     ...validacion,
//                     fecha_baja: validarCampo(estado, campo, validadorCampos.fecha_baja),
//                 };
//             }
//             case "de_baja": {
//                 const v1 = {
//                     ...validacion,
//                     fecha_baja: validarCampo(estado, campo, validadorCampos.fecha_baja_segun_de_baja),
//                 };
//                 return {
//                     ...v1,
//                     fecha_baja: validarCampo(estado, "fecha_baja", validadorCampos.fecha_baja),
//                 };
//             }
//             default: {
//                 return makeValidador(validadorCampos)(estado, campo);
//             }
//         }
//     }

export const metaCliente: MetaModelo<Cliente> = {
    // validador: makeValidadorCliente(validacionesCliente),
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
    }
};
export const clienteEsValido = (cliente: EstadoModelo<Cliente>) => modeloEsValido<Cliente>(metaCliente)(cliente);

export const metaNuevoCliente: MetaModelo<NuevoCliente> = {
    // validador: makeValidador({}),
    campos: {
        nombre: { requerido: true },
        tipo_id_fiscal: { requerido: true },
        id_fiscal: { requerido: true },
    }
};

export const metaDireccion: MetaModelo<DirCliente> = {
    // validador: makeValidador({}),
    campos: {
        tipo_via: { requerido: true },
        nombre_via: { requerido: true },
        ciudad: { requerido: true },
    }
};

export const metaNuevaDireccion: MetaModelo<NuevaDireccion> = {
    // validador: makeValidador({}),
    campos: {
        nombre_via: { requerido: true },
        ciudad: { requerido: true },
    }
};

export const metaCuentaBanco: MetaModelo<CuentaBanco> = {
    // validador: makeValidador({}),
    campos: {
        iban: { requerido: true },
        bic: { requerido: true },
    }
};

export const metaNuevaCuentaBanco: MetaModelo<NuevaCuentaBanco> = {
    // validador: makeValidador({}),
    campos: {
        cuenta: { requerido: true },
    }
};

export const metaCrmContacto: MetaModelo<CrmContacto> = {
    // validador: makeValidador({}),
    campos: {
        nombre: { requerido: true },
        email: { requerido: true },
    }
};

export const metaNuevoCrmContacto: MetaModelo<NuevoCrmContacto> = {
    // validador: makeValidador({}),
    campos: {
        nombre: { requerido: true },
        email: { requerido: true },
    }
};

export const metaDarDeBaja: MetaModelo<FormBaja> = {
    // validador: makeValidador({}),
    campos: {
        fecha_baja: { requerido: true },
    }
};


export const initEstadoClienteVacio = () => initEstadoCliente(clienteVacio())


