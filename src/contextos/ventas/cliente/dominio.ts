import { stringNoVacio } from "../../comun/dominio.ts";
import { Cliente, DirCliente, NuevaDireccion, NuevoCliente } from "./diseño.ts";

export const idFiscalValido = (tipo: string) => (valor: string) => {
    if (tipo === "NIF") {
        return valor.length === 9;
    }
    if (tipo === "NAF") {
        return valor.length === 11 && valor[0] === "E" && valor[1] === "S";
    }
    return false;
}
export const tipoIdFiscalValido = (tipo: string) => {
    return tipo === "NIF" || tipo === "NAF";
}

export const idFiscalValidoGeneral = (tipo: string, valor: string) => {
    return idFiscalValido(tipo)(valor) && tipoIdFiscalValido(tipo);
}

export const puedoMarcarDireccionFacturacion = (direccion: DirCliente) => {
    return !direccion.dir_facturacion;
}


export const clienteVacio = (): Cliente => ({
    id: "",
    nombre: "",
    id_fiscal: "",
    grupo_id: "",
    telefono1: "",
    telefono2: "",
    email: "",
    web: "",
    observaciones: "",
    copiasfactura: 0,
    fechabaja: "",
    contacto_id: "",
    forma_pago_id: "",
    divisa_id: "",
    serie_id: "",
    grupo_iva_negocio_id: "",
    agente_id: "",
    tipo_id_fiscal: "",
    de_baja: false,
    cuenta_domiciliada: "",
});


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
    agente_id: (_: string) => true,
    divisa_id: (_: string) => true,
    tipo_id_fiscal: (_: string) => true,
    serie_id: (_: string) => true,
    forma_pago_id: (_: string) => true,
    grupo_iva_negocio_id: (_: string) => true,
    email: (_: string) => true,
    telefono: (_: string) => true,
};

export const validarNuevoCliente = (cliente: NuevoCliente): boolean => {
    return (
        validadoresCliente.nombre(cliente.nombre) &&
        validadoresCliente.id_fiscal(cliente.id_fiscal)
    );
};
