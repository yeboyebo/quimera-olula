import { RestAPI } from "./api/rest_api.ts";
import { EntidadAccion } from "./diseño.ts";

export const crearAcciones = <T extends EntidadAccion>(entidad: string) => {
    const baseUrl = `/ventas/${entidad}`;

    const obtenerTodos = async () =>
        RestAPI.get<{ [key: string]: T[] }>(baseUrl).then((respuesta) => {
            console.log("respuesta get", respuesta);
            return respuesta[`${entidad}s`];
        });

    const obtenerUno = async (id: string) =>
        RestAPI.get<T>(`${baseUrl}/${id}`);

    const crearUno = async (data: T) =>
        RestAPI.post(baseUrl, data).then((respuesta) => {
            console.log("respuesta", respuesta);
            return respuesta;
        });

    const actualizarUno = async (id: string, data: Partial<T>) => {
        console.log("patch", data);
        return RestAPI.patch(`${baseUrl}/${id}`, data);
    };

    const eliminarUno = async (id: string) =>
        RestAPI.delete(`${baseUrl}/${id}`);

    return {
        obtenerTodos,
        obtenerUno,
        crearUno,
        actualizarUno,
        eliminarUno,
    };
};

export const crearAccionesRelacionadas = <T extends EntidadAccion>(entidad: string, relatedPath: string, id: string) => {
    const baseUrl = `/ventas/${entidad}/${id}/${relatedPath}`;

    const obtenerTodos = async () =>
        RestAPI.get<{ [key: string]: T[] }>(baseUrl).then((respuesta) => {
            return respuesta[`${relatedPath}s`];
        });

    const obtenerUno = async (relatedId: string) =>
        RestAPI.get<{ [key: string]: T }>(`${baseUrl}/${relatedId}`).then((respuesta) => {
            return respuesta[relatedPath];
        });

    const crearUno = async (data: T) =>
        RestAPI.post(baseUrl, data);

    const actualizarUno = async (relatedId: string, data: Partial<T>) =>
        RestAPI.patch(`${baseUrl}/${relatedId}`, data);

    const eliminarUno = async (relatedId: string) =>
        RestAPI.delete(`${baseUrl}/${relatedId}`);

    return {
        obtenerTodos,
        obtenerUno,
        crearUno,
        actualizarUno,
        eliminarUno,
    };
};