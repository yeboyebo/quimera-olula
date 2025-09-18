import { EstadoModelo, initEstadoModelo, MetaModelo, stringNoVacio } from "../../comun/dominio.ts";
import { NuevoProveedor, Proveedor } from "./diseño.ts";





export const proveedorVacio = (): Proveedor => ({
    id: '',
    nombre: '',
})

export const nuevoProveedorVacio: NuevoProveedor = {
    nombre: '',
}

export const validadoresProveedor = {
    nombre: (valor: string) => stringNoVacio(valor),
};


export const initEstadoProveedor = (proveedor: Proveedor): EstadoModelo<Proveedor> => {
    return initEstadoModelo(proveedor);
}


export const metaProveedor: MetaModelo<Proveedor> = {
    campos: {
        nombre: { requerido: true },
    }
};


export const metaNuevoProveedor: MetaModelo<NuevoProveedor> = {
    campos: {
        nombre: { requerido: true },
    }
};

export const initEstadoProveedorVacio = () => initEstadoProveedor(proveedorVacio())


