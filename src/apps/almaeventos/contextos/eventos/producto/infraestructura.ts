import { Filtro, Orden } from "../../../../../contextos/comun/diseño.ts";
import { NuevoProducto, Producto } from "./diseño.ts";

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
    const evento = productosFake.find((e) => e.id === id);
    if (!evento) throw new Error("Producto no encontrado");
    return evento;
};

export const getProductos = async (_filtro: Filtro, _orden: Orden): Promise<Producto[]> => {
    return productosFake;
};

// Las siguientes funciones se mantienen igual para cuando la API esté lista
export const postProducto = async (_evento: NuevoProducto): Promise<string> => {
    return "fake-id";
};

export const patchProducto = async (_id: string, _evento: Partial<Producto>): Promise<void> => { };

export const deleteProducto = async (_id: string): Promise<void> => { };