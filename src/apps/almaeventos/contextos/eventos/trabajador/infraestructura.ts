import { Filtro, Orden } from "../../../../../contextos/comun/diseño.ts";
import { NuevoTrabajador, Trabajador } from "./diseño.ts";

// Datos falsos para desarrollo
const trabajadoresFake: Trabajador[] = [
    {
        id: "TR00001",
        nombre: "Juan Martínez Arnau",
        coste: 10.5,
    },
    {
        id: "TR00002",
        nombre: "Román Lopez Grau",
        coste: 10.5,
    },
    {
        id: "TR00003",
        nombre: "Antonio De la Osa Segundo",
        coste: 10.5,
    },
    {
        id: "TR00004",
        nombre: "Javier Teruel García",
        coste: 10.5,
    },
];

export const getTrabajador = async (id: string): Promise<Trabajador> => {
    const trabajador = trabajadoresFake.find((e) => e.id === id);
    if (!trabajador) throw new Error("Trabajador no encontrado");
    return trabajador;
};

export const getTrabajadores = async (_filtro: Filtro, _orden: Orden): Promise<Trabajador[]> => {
    return trabajadoresFake;
};

// Las siguientes funciones se mantienen igual para cuando la API esté lista
export const postTrabajador = async (_trabajador: NuevoTrabajador): Promise<string> => {
    return "fake-id";
};

export const patchTrabajador = async (_id: string, _trabajador: Partial<Trabajador>): Promise<void> => { };

export const deleteTrabajador = async (_id: string): Promise<void> => { };