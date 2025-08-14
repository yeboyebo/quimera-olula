import { RestAPI } from "../../comun/api/rest_api.ts";
import { Filtro, Orden, Paginacion, RespuestaLista } from "../../comun/diseño.ts";
import { criteriaQuery } from "../../comun/infraestructura.ts";
import { Incidencia, IncidenciaAPI } from "./diseño.ts";

const baseUrlIncidencia = `/crm/incidencia`;
// const baseUrlAccion = `/crm/accion`;
// const baseUrlOportunidadVenta = `/crm/oportunidad_venta`;

export const IncidenciaFromAPI = (l: IncidenciaAPI): Incidencia => ({
    ...l,
});

export const IncidenciaToAPI = (l: Incidencia): IncidenciaAPI => {
    const {
        ...rest
    } = l;
    return {
        ...rest,
    };
};

export const getIncidencia = async (id: string): Promise<Incidencia> =>
    await RestAPI.get<{ datos: IncidenciaAPI }>(`${baseUrlIncidencia}/${id}`).then((respuesta) =>
        IncidenciaFromAPI(respuesta.datos)
    );


export const getIncidencias = async (
    filtro: Filtro,
    orden: Orden,
    paginacion?: Paginacion
): RespuestaLista<Incidencia> => {
    const q = criteriaQuery(filtro, orden, paginacion);

    const respuesta = await RestAPI.get<{ datos: IncidenciaAPI[]; total: number }>(baseUrlIncidencia + q);
    return { datos: respuesta.datos.map(IncidenciaFromAPI), total: respuesta.total };
};

export const postIncidencia = async (Incidencia: Partial<Incidencia>): Promise<string> => {
    return await RestAPI.post(baseUrlIncidencia, Incidencia, "Error al guardar Incidencia").then(
        (respuesta) => respuesta.id
    );
};

export const patchIncidencia = async (id: string, Incidencia: Partial<Incidencia>): Promise<void> => {
    const apiIncidencia = IncidenciaToAPI(Incidencia as Incidencia);
    // Convierte nulls a ""
    const IncidenciaSinNulls = Object.fromEntries(
        Object.entries(apiIncidencia).map(([k, v]) => [k, v === null ? "" : v])
    );
    await RestAPI.patch(`${baseUrlIncidencia}/${id}`, IncidenciaSinNulls, "Error al guardar Incidencia");
};

export const deleteIncidencia = async (id: string): Promise<void> =>
    await RestAPI.delete(`${baseUrlIncidencia}/${id}`, "Error al borrar Incidencia");


// export const getOportunidadesVentaIncidencia = async (IncidenciaId: string) => {
//     const filtro = ['tarjeta_id', IncidenciaId] as unknown as Filtro;

//     const orden = [] as Orden;

//     const q = criteriaQueryUrl(filtro, orden);
//     return RestAPI.get<{ datos: OportunidadVenta[] }>(baseUrlOportunidadVenta + q).then((respuesta) => respuesta.datos);
// };

// export const getAccionesIncidencia = async (IncidenciaId: string) => {
//     const filtro = ['tarjeta_id', IncidenciaId] as unknown as Filtro;

//     const orden = [] as Orden;

//     const q = criteriaQueryUrl(filtro, orden);
//     return RestAPI.get<{ datos: Accion[] }>(baseUrlAccion + q).then((respuesta) => respuesta.datos);
// };
