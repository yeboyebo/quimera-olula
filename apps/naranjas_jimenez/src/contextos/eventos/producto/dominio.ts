import { EstadoModelo, initEstadoModelo, MetaModelo } from "@olula/lib/dominio.ts";
import { NuevoProducto, Producto } from "./diseño.ts";

export const productoVacio: Producto = {
    id: '',
    descripcion: '',
    codFamilia: "EVEN"
};

export const nuevoProductoVacio: NuevoProducto = {
    id: '',
    descripcion: '',
    codFamilia: "EVEN"
};

export const metaProducto: MetaModelo<Producto> = {
    campos: {
        descripcion: { requerido: true, tipo: "texto" },
        // Agrega aquí más campos según validaciones necesarias
    },
};

export const metaNuevoProducto: MetaModelo<NuevoProducto> = {
    campos: {
        id: { requerido: true, tipo: "texto" },
        descripcion: { requerido: true, tipo: "texto" },
        // referencia: { requerido: true, validacion: (producto: NuevoProducto) => stringNoVacio(producto.referencia) },
    },
};

export const initEstadoProducto = (producto: Producto): EstadoModelo<Producto> =>
    initEstadoModelo(producto);

export const initEstadoProductoVacio = () => initEstadoProducto(productoVacio);