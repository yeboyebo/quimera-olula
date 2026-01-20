import ApiUrls from "#/tpv/comun/urls.ts";
import { RestAPI } from "@olula/lib/api/rest_api.js";
import { Criteria } from "@olula/lib/diseño.js";
import { criteriaAQueryString } from "@olula/lib/infraestructura.js";
import { GetPuntosVentaTpv, PuntoVentaTpv } from "./diseño.ts";

type PuntoVentaTpvAPI = {
    id: string;
    nombre: string;
}

const baseUrl = new ApiUrls().PUNTO_VENTA;

export const puntoVentaDesdeAPI = (a: PuntoVentaTpvAPI): PuntoVentaTpv => ({
    id: a.id,
    nombre: a.nombre
});

export const getPuntosVentaTpv: GetPuntosVentaTpv = async (
    criteria: Criteria,
) => {
    const url = `${baseUrl}` + criteriaAQueryString(criteria);

    const respuesta = await RestAPI.get<{ datos: PuntoVentaTpvAPI[]; total: number }>(url);
    return {
        datos: respuesta.datos.map(puntoVentaDesdeAPI),
        total: respuesta.total
    };
};
