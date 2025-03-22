import { Cliente, Direccion, NuevaDireccion } from "./diseño.ts";
import { getDireccion, getDirecciones, getPorId, postDireccion, setDirFacturacion } from "./infraestructura.ts";

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

export const guardar = async (idCliente: string, cambios: Partial<Cliente>) => {
    await simularApi();
}

export const actualizarDireccionEnLista = (direcciones: Direccion[], direccion: Direccion) => {
    return direcciones.map(d => d.id === direccion.id ? direccion : d);
}

export const clienteVacio = (): Cliente => ({
    id: '',
    nombre: '',
    id_fiscal: '',
    tipo_id_fiscal: '',
    email: '',
    telefono: '',
    agente_id: '',
    divisa_id: '',
    serie_id: '',
    forma_pago_id: '',
    grupo_iva_negocio_id: '',
})

const noVacio = (valor: string) => valor.length > 0;

export const validadoresDireccion = {
    nuevaDireccion: (valor: NuevaDireccion) => validadoresDireccion.tipo_via(valor.tipo_via) && validadoresDireccion.nombre_via(valor.nombre_via) && validadoresDireccion.ciudad(valor.ciudad),
    tipo_via: (valor: string) => noVacio(valor),
    nombre_via: (valor: string) => noVacio(valor),
    ciudad: (valor: string) => noVacio(valor),
}

export const cambiarDireccion = async (clienteId: string, direccionId: string, cambios: Partial<Direccion>) => {
    await simularApi();
}

export const guardarNuevaDireccion = async (clienteId: string, direccion: NuevaDireccion): Promise<string> => {
    return await postDireccion(clienteId, direccion);
}

export const buscarDireccion = async (clienteId: string, direccionId: string): Promise<Direccion> => {
    return await getDireccion(clienteId, direccionId);
}

export const buscar = async (idCliente: string): Promise<Cliente> => {
    return await getPorId(idCliente);
}

export const buscarDirecciones = async (idCliente: string): Promise<Direccion[]> => {
    const direcciones = await getDirecciones(idCliente);
    console.log('direcciones = ', direcciones);
    return direcciones;
}

export const marcarDireccionFacturacion = async (idCliente: string, idDireccion: string) => {
    await setDirFacturacion(idCliente, idDireccion);
}

const simularApi = async () => {
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
    await delay(700);
}