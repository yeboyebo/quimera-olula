import { RestAPI } from "../../api/rest_api.ts";
import ApiUrls from "../../api/urls.ts";
import { RespuestaLista2 } from "../../diseño.ts";
import { criteriaQuery } from "../../infraestructura.ts";
import { GetPaises, Pais } from "./diseño.ts";


export const getPaises: GetPaises = async (filtro, orden, paginacion) => {

    const q = criteriaQuery(filtro, orden, paginacion);
    const respuesta = await RestAPI.get<RespuestaLista2<Pais>>(ApiUrls.COMUN_PAIS + q);

    return { datos: respuesta.datos, total: respuesta.total };
};