import ApiUrls from "#/tpv/comun/urls.ts";
import { RestAPI } from "@olula/lib/api/rest_api.js";
import { Filtro, Orden, Paginacion } from "@olula/lib/diseño.js";
import { criteriaQuery } from "@olula/lib/infraestructura.js";
import { ArqueoTpv, GetArqueosTpv, GetArqueoTpv } from "./diseño.ts";

type ArqueoTpvAPI = {
    id: string;
    tiempo_inicio: string;
    tiempo_fin: string | null;
    abierto: boolean;

}

const baseUrl = new ApiUrls().ARQUEO;

export const arqueoDesdeAPI = (a: ArqueoTpvAPI): ArqueoTpv => ({
    id: a.id,
    fechahora_inicio: new Date(a.tiempo_inicio),
    fechahora_fin: a.tiempo_fin ? new Date(a.tiempo_fin) : null,
    abierto: a.abierto,
});

export const getArqueos: GetArqueosTpv = async (
    filtro: Filtro,
    orden: Orden,
    paginacion: Paginacion
) => {
    const q = criteriaQuery(filtro, orden, paginacion);

    const respuesta = await RestAPI.get<{ datos: ArqueoTpvAPI[]; total: number }>(baseUrl + q);
    return { datos: respuesta.datos.map(arqueoDesdeAPI), total: respuesta.total };
};

export const getArqueo: GetArqueoTpv = async (id) => {
    return RestAPI.get<{ datos: ArqueoTpvAPI }>
        (`${baseUrl}/${id}`)
        .then(
            (respuesta) => arqueoDesdeAPI(respuesta.datos)
        );
};