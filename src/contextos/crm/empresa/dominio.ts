import { EstadoModelo, initEstadoModelo, MetaModelo, stringNoVacio } from "../../comun/dominio.ts";

export type Empresa = {
    id: string;
    nombre: string;
};

export const empresaVacia: Empresa = {
    id: "",
    nombre: ""
};

export const metaEmpresa: MetaModelo<Empresa> = {
    campos: {
        nombre: { requerido: true, tipo: "texto" },
    },
};

export const initEstadoEmpresa = (empresa: Empresa): EstadoModelo<Empresa> =>
    initEstadoModelo(empresa);

export const initEstadoEmpresaVacia = () => initEstadoEmpresa(empresaVacia);

export type NuevaEmpresa = {
    nombre: string;
};

export const nuevaEmpresaVacia: NuevaEmpresa = {
    nombre: "",
};

export const metaNuevaEmpresa: MetaModelo<NuevaEmpresa> = {
    campos: {
        nombre: { requerido: true, validacion: (empresa: NuevaEmpresa) => stringNoVacio(empresa.nombre) },
    },
};
