import { Cliente, Direccion } from "./diseño.ts";
import { getDirecciones, getPorId, setDirFacturacion } from "./infraestructura.ts";

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