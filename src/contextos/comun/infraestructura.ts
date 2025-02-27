import { RestAPI } from "./api/rest_api.ts";
import { Acciones, Entidad } from "./diseño.ts";

export const crearAcciones = <T extends Entidad>(entidad: string): Acciones<T> => {
    const baseUrl = `/ventas/${entidad}`;

    const obtenerTodos = async (): Promise<T[]> =>
        RestAPI.get<{ [key: string]: T[] }>(baseUrl).then((respuesta) => {
            console.log("respuesta get", respuesta);
            return respuesta[`${entidad}s`];
        });

    const obtenerUno = async (id: string): Promise<T> =>
        RestAPI.get<T>(`${baseUrl}/${id}`);

    const crearUno = async (data: T): Promise<void> =>
        RestAPI.post(baseUrl, data).then((respuesta) => {
            console.log("respuesta", respuesta);
            return respuesta;
        });

    const actualizarUno = async (id: string, data: Partial<T>): Promise<void> => {
        console.log("patch", data);
        return RestAPI.patch(`${baseUrl}/${id}`, data);
    };

    const eliminarUno = async (id: string): Promise<void> =>
        RestAPI.delete(`${baseUrl}/${id}`);

    return {
        obtenerTodos,
        obtenerUno,
        crearUno,
        actualizarUno,
        eliminarUno,
    };
};

export const crearAccionesRelacionadas = <T extends Entidad>(entidad: string, relatedPath: string, id: string): Acciones<T> => {
    const baseUrl = `/ventas/${entidad}/${id}/${relatedPath}`;

    const obtenerTodos = async (): Promise<T[]> =>
        RestAPI.get<{ [key: string]: T[] }>(baseUrl).then((respuesta) => {
            let path = `${relatedPath}s`;
            if (relatedPath === "direcciones") {
                path = "direcciones";
            }
            return respuesta[path];
        });

    const obtenerUno = async (relatedId: string): Promise<T> =>
        RestAPI.get<{ [key: string]: T }>(`${baseUrl}/${relatedId}`).then((respuesta) => {
            return respuesta[relatedPath];
        });

    const crearUno = async (data: T): Promise<void> =>
        RestAPI.post(baseUrl, data);

    const actualizarUno = async (relatedId: string, data: Partial<T>): Promise<void> =>
        RestAPI.patch(`${baseUrl}/${relatedId}`, data);

    const eliminarUno = async (relatedId: string): Promise<void> =>
        RestAPI.delete(`${baseUrl}/${relatedId}`);

    return {
        obtenerTodos,
        obtenerUno,
        crearUno,
        actualizarUno,
        eliminarUno,
    };
};