import { idFiscalValido, tipoIdFiscalValido } from "../../valores/idfiscal.ts";

export const idFiscalValidoGeneral = (tipo: string, valor: string) => {
    return idFiscalValido(tipo)(valor) && tipoIdFiscalValido(tipo) === true;
}

// export const validadoresDireccion = {
//     nuevaDireccion: (valor: NuevaDireccion) => (
//         validadoresDireccion.tipo_via(valor.tipo_via) &&
//         validadoresDireccion.nombre_via(valor.nombre_via) &&
//         validadoresDireccion.ciudad(valor.ciudad)
//     ),
//     tipo_via: (valor: string) => stringNoVacio(valor),
//     nombre_via: (valor: string) => stringNoVacio(valor),
//     ciudad: (valor: string) => stringNoVacio(valor),
// }

// export const validadoresCliente = {
//     nombre: (valor: string) => stringNoVacio(valor),
//     id_fiscal: (valor: string) => stringNoVacio(valor),
//     nuevoCliente: (cliente: NuevoCliente) =>
//         cliente.nombre && cliente.id_fiscal,
// };


// export const initEstadoCliente = (cliente: Cliente): EstadoModelo<Cliente> => {
//     return initEstadoModelo(cliente);
// }

// export const initEstadoDireccion = (direccion: DirCliente): EstadoModelo<DirCliente> => {
//     return initEstadoModelo(direccion);
// }

// export const initEstadoClienteVacio = () => initEstadoCliente(clienteVacio())





