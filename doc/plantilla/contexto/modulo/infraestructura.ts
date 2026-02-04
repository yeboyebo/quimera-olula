import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { Filtro, Orden, Paginacion, RespuestaLista } from "@olula/lib/diseño.ts";
import { criteriaQuery } from "@olula/lib/infraestructura.ts";
import ApiUrls from "../comun/urls.ts";
import { Modulo, ModuloAPI, NuevoModulo } from "./diseño.ts";

const baseUrl = new ApiUrls().MODULO;

/**
 * Mapea respuesta de API a interfaz del dominio
 * Convierte tipos del API a tipos del dominio (ej: string a Date)
 */
const moduloFromAPI = (api: ModuloAPI): Modulo => ({
    id: api.id,
    nombre: api.nombre,
    descripcion: api.descripcion,
    estado: api.estado as 'activo' | 'inactivo',
    fecha_creacion: new Date(Date.parse(api.fecha_creacion)),
});

/**
 * Mapea dominio a API
 * Convierte tipos del dominio a tipos que entiende el backend
 */
const moduloToAPI = (m: Modulo): ModuloAPI => ({
    id: m.id,
    nombre: m.nombre,
    descripcion: m.descripcion,
    estado: m.estado,
    fecha_creacion: m.fecha_creacion.toISOString(),
});

const nuevoModuloToAPI = (m: NuevoModulo): Omit<ModuloAPI, "id"> => ({
    nombre: m.nombre,
    descripcion: m.descripcion,
    estado: m.estado,
    fecha_creacion: m.fecha_creacion.toISOString(),
});

const patchModuloToAPI = (m: Partial<Modulo>): Partial<ModuloAPI> => ({
    ...m,
    fecha_creacion: m.fecha_creacion ? m.fecha_creacion.toISOString() : undefined,
});

/**
 * Obtener un módulo por ID
 */
export const getModulo = async (id: string): Promise<Modulo> =>
    RestAPI.get<{ datos: ModuloAPI }>(`${baseUrl}/${id}`, "Error al obtener módulo").then((respuesta) => {
        return moduloFromAPI(respuesta.datos);
    });

/**
 * Obtener lista de módulos con filtros
 */
export const getModulos = async (
    filtro: Filtro,
    orden: Orden,
    paginacion: Paginacion
): Promise<RespuestaLista<Modulo>> => {
    const q = criteriaQuery(filtro, orden, paginacion);
    const respuesta = await RestAPI.get<{ datos: ModuloAPI[]; total: number }>(
        `${baseUrl}${q}`,
        "Error al obtener módulos"
    );
    return {
        datos: respuesta.datos.map(moduloFromAPI),
        total: respuesta.total,
    };
};

/**
 * Crear nuevo módulo
 */
export const postModulo = async (modulo: NuevoModulo): Promise<string> =>
    RestAPI.post<ReturnType<typeof nuevoModuloToAPI>>(
        `${baseUrl}`,
        nuevoModuloToAPI(modulo),
        "Error al crear módulo"
    ).then((respuesta) => {
        return respuesta.id;
    });

/**
 * Actualizar módulo existente
 */
export const patchModulo = async (id: string, modulo: Partial<Modulo>): Promise<void> => {
    await RestAPI.patch<ReturnType<typeof patchModuloToAPI>>(
        `${baseUrl}/${id}`,
        patchModuloToAPI(modulo),
        "Error al actualizar módulo"
    );
};

/**
 * Eliminar módulo
 */
export const deleteModulo = async (id: string): Promise<void> => {
    await RestAPI.delete(`${baseUrl}/${id}`, "Error al eliminar módulo");
};
