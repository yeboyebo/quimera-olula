import { MetaModelo } from "@olula/lib/dominio.js";


export type CambioClienteRegistrado = {
    idCliente: string,
    idDireccion: string,
    nombre: string,
}

export type CambioClienteNoRegistrado = {
    nombre: string;
    idFiscal: string;
    nombreVia: string;
    tipoVia?: string;
    numero?: string;
    otros?: string;
    codPostal: string;
    ciudad?: string;
    idProvincia?: string;
    provincia?: string;
    idPais?: string;
    apartado?: string;
    telefono?: string;
}

export const cambioClienteRegistradoVacio: CambioClienteRegistrado = {
    idCliente: "",
    idDireccion: "",
    nombre: "",
}

export const cambioClienteNoRegistradoVacio: CambioClienteNoRegistrado = {
    nombre: "",
    idFiscal: "",
    nombreVia: "",
    tipoVia: "",
    numero: "",
    otros: "",
    codPostal: "",
    ciudad: "",
    idProvincia: "",
    provincia: "",
    idPais: "",
    apartado: "",
    telefono: "",
}

export const metaCambioClienteRegistrado: MetaModelo<CambioClienteRegistrado> = {
    campos: {
        idCliente: { requerido: true },
        idDireccion: { requerido: true },
    }
};

export const metaCambioClienteNoRegistrado: MetaModelo<CambioClienteNoRegistrado> = {
    campos: {
        nombre: { requerido: true },
        idFical: { requerido: true },
        nombreVia: { requerido: true },
    }
};