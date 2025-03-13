import { RestAPI } from "./api/rest_api.ts";
import { Acciones, Entidad } from "./diseño.ts";

export const crearAcciones = <T extends Entidad>(entidad: string): Acciones<T> => {
    const baseUrl = `/ventas/${entidad}`;

    const obtenerTodos = async (): Promise<T[]> =>
        RestAPI.get<{ [key: string]: T[] }>(baseUrl).then((respuesta) => respuesta.datos);

    const obtenerUno = async (id: string): Promise<T> =>
        RestAPI.get<{ datos: T }>(`${baseUrl}/${id}`).then((respuesta) => respuesta.datos);

    const crearUno = async (data: T): Promise<void> =>
        RestAPI.post(baseUrl, data).then((respuesta) => respuesta);

    const actualizarUno = async (id: string, data: Partial<T>): Promise<void> => {
        return RestAPI.patch(`${baseUrl}/${id}`, data);
    };

    const actualizarUnElemento = async (id: string, data: Partial<T>, nombreAccion: string): Promise<void> =>
        RestAPI.patch(`${baseUrl}/${id}/${nombreAccion}`, data);

    const eliminarUno = async (id: string): Promise<void> =>
        RestAPI.delete(`${baseUrl}/${id}`);


    const buscar = async (campo: string, valor: string): Promise<T[]> => {
        return [{ [campo]: valor } as unknown as T];
    };

    const seleccionarEntidad = (e: Entidad): void => {
        // Implement select entity logic here
        console.log(e);
    };

    return {
        obtenerTodos,
        obtenerUno,
        crearUno,
        actualizarUno,
        actualizarUnElemento,
        eliminarUno,
        buscar,
        seleccionarEntidad,
    };
};

export const crearAccionesRelacionadas = <T extends Entidad>(entidad: string, relatedPath: string, id: string): Acciones<T> => {
    if (!id) {
        throw new Error("Se necesita un id para las acciones relacionadas");
    }

    const baseUrl = `/ventas/${entidad}/${id}/${relatedPath}`;

    const obtenerTodos = async (): Promise<T[]> =>
        RestAPI.get<{ [key: string]: T[] }>(baseUrl).then((respuesta) => {
            return respuesta['datos'];
        });

    const obtenerUno = async (relatedId: string): Promise<T> =>
        RestAPI.get<{ [key: string]: T }>(`${baseUrl}/${relatedId}`).then((respuesta) => {
            return respuesta['datos'];
        });

    const crearUno = async (data: T): Promise<void> => {
        const payload = {
            lineas: [data]
        }
        return RestAPI.post(baseUrl, payload);
    }

    const actualizarUno = async (relatedId: string, data: Partial<T>): Promise<void> =>
        RestAPI.patch(`${baseUrl}/${relatedId}`, data);

    const actualizarUnElemento = async (relatedId: string, data: Partial<T>, nombreAccion: string): Promise<void> =>
        RestAPI.patch(`${baseUrl}/${relatedId}/${nombreAccion}`, data);

    const eliminarUno = async (relatedId: string): Promise<void> =>
        RestAPI.delete(`${baseUrl}/${relatedId}`);

    const buscar = async (_campo: string, valor: string): Promise<T[]> => {
        return [{ campo: valor } as unknown as T];
    };

    const seleccionarEntidad = (e: Entidad): void => {
        // Implement select entity logic here
        console.log(e);
    };

    return {
        obtenerTodos,
        obtenerUno,
        crearUno,
        actualizarUno,
        actualizarUnElemento,
        eliminarUno,
        buscar,
        seleccionarEntidad,
    };
};