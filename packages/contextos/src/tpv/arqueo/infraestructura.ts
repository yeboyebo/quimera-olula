import ApiUrls from "#/tpv/comun/urls.ts";
import { RestAPI } from "@olula/lib/api/rest_api.js";
import { Filtro, Orden, Paginacion } from "@olula/lib/diseño.js";
import { criteriaAQueryString, criteriaQuery } from "@olula/lib/infraestructura.js";
import { ArqueoTpv, GetArqueosTpv, GetArqueoTpv, GetPagosArqueoTpv, PagoArqueoTpv } from "./diseño.ts";

type ArqueoTpvAPI = {
    id: string;
    tiempo_inicio: string;
    tiempo_fin: string | null;
    abierto: boolean;
    total_efectivo: number;
    total_tarjeta: number;
    total_vales: number;

}

const baseUrl = new ApiUrls().ARQUEO;

export const arqueoDesdeAPI = (a: ArqueoTpvAPI): ArqueoTpv => ({
    id: a.id,
    fechahora_inicio: new Date(a.tiempo_inicio),
    fechahora_fin: a.tiempo_fin ? new Date(a.tiempo_fin) : null,
    abierto: a.abierto,
    totalEfectivo: a.total_efectivo,
    totalTarjeta: a.total_tarjeta,
    totalVales: a.total_vales,
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

type PagoArqueoTpvAPI = {
    id: string;
    fecha: string;
    importe: number;
    codigo_venta: string;
    forma_pago: string;
}

const pagoDesdeAPI = (p: PagoArqueoTpvAPI): PagoArqueoTpv => ({
    id: p.id,
    importe: p.importe,
    formaPago: p.forma_pago,
    fecha: new Date(p.fecha),
    codigoVenta: p.codigo_venta,
});

export const getPagosArqueo: GetPagosArqueoTpv = async (id, criteria) => {

    const url = `${baseUrl}/${id}/pagos` + criteriaAQueryString(criteria);
    const pagosApi = await RestAPI.get<{ datos: PagoArqueoTpvAPI[], total: number }>(url);
    return {
        datos: pagosApi.datos.map(pagoDesdeAPI),
        total: pagosApi.total
    };
}