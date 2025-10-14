import { RestAPI } from "@olula/lib/api/rest_api.ts";
import ApiUrls from "@olula/lib/api/urls.ts";
import { RespuestaLista2 } from "@olula/lib/diseño.ts";
import { criteriaQuery } from "@olula/lib/infraestructura.ts";
import { GetPaises, Pais } from "./diseño.ts";


export const getPaises: GetPaises = async (filtro, orden, paginacion) => {

    const q = criteriaQuery(filtro, orden, paginacion);
    const respuesta = await RestAPI.get<RespuestaLista2<Pais>>(ApiUrls.COMUN_PAIS + q);

    return { datos: respuesta.datos, total: respuesta.total };
};