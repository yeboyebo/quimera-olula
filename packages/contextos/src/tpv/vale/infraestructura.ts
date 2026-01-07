import { RestAPI } from "@olula/lib/api/rest_api.js";
import ApiUrls from "../comun/urls.ts";
import { GetValeTpv, ValeTpv } from "./diseño.ts";

const baseUrl = new ApiUrls().VALE;

type ValeTpvAPI = ValeTpv

export const valeDesdeAPI = (p: ValeTpvAPI): ValeTpv => p;


export const getVale: GetValeTpv = async (id) => {

    return RestAPI.get<{ datos: ValeTpv }>(
        `${baseUrl}/${id}`).then((respuesta) => {
            return valeDesdeAPI(respuesta.datos);
        });
};