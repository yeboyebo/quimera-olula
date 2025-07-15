
import { EstadoModelo, initEstadoModelo, MetaModelo } from "../../../../../contextos/comun/dominio.ts";
import { NuevoProducto, Producto } from "./diseño.ts";

export const productoVacio: Producto = {
    id: '',
    descripcion: '',
};

export const nuevoProductoVacio: NuevoProducto = {
    id: '',
    descripcion: '',
};

export const metaProducto: MetaModelo<Producto> = {
    campos: {
        // referencia: { requerido: false },
        // descripcion: { requerido: false },
        // Agrega aquí más campos según validaciones necesarias
    },
};

export const metaNuevoProducto: MetaModelo<NuevoProducto> = {
    campos: {
        // referencia: { requerido: true, validacion: (producto: NuevoProducto) => stringNoVacio(producto.referencia) },
    },
};

export const initEstadoProducto = (producto: Producto): EstadoModelo<Producto> =>
    initEstadoModelo(producto);

export const initEstadoProductoVacio = () => initEstadoProducto(productoVacio);