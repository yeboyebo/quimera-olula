import { RestAPI } from "../../../../../contextos/comun/api/rest_api.ts";
import { Filtro, Orden } from "../../../../../contextos/comun/diseño.ts";
import { criteriaQuery } from "../../../../../contextos/comun/infraestructura.ts";
import { NuevoProducto, Producto } from "./diseño.ts";

const baseUrlProducto = `/eventos/producto`;

// Datos falsos para desarrollo
const productosFake: Producto[] = [
    {
        id: "kraken",
        descripcion: "Kraken",
    },
    {
        id: "monster",
        descripcion: "Monster",
    },
    {
        id: "party",
        descripcion: "Party",
    },
    {
        id: "prueba",
        descripcion: "Prueba",
    },
];

export const getProducto = async (id: string): Promise<Producto> => {
    const producto = productosFake.find((e) => e.id === id);
    if (!producto) throw new Error("Producto no encontrado");
    return producto;
};

export const getProductos = async (_filtro: Filtro, _orden: Orden): Promise<Producto[]> => {
    // return productosFake;
    const q = criteriaQuery(_filtro, _orden);
    return RestAPI.get<{ datos: Producto[] }>(baseUrlProducto + q).then((respuesta) => respuesta.datos);
};



// Las siguientes funciones se mantienen igual para cuando la API esté lista
export const postProducto = async (_producto: NuevoProducto): Promise<string> => {
    return "fake-id";
};

export const patchProducto = async (_id: string, _producto: Partial<Producto>): Promise<void> => { };

export const deleteProducto = async (_id: string): Promise<void> => { };