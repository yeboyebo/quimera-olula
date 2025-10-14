import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { Filtro, Orden } from "@olula/lib/diseño.ts";
import { criteriaQuery } from "@olula/lib/infraestructura.ts";
import { Agente } from "./diseño.ts";

const baseUrlVentas = `/ventas/agente`;
type AgenteApi = Agente;

const agenteDesdeAgenteApi = (a: AgenteApi): Agente => a

export const getAgentes = async (filtro: Filtro, orden: Orden): Promise<Agente[]> => {
    const q = criteriaQuery(filtro, orden);

    return RestAPI.get<{ datos: AgenteApi[] }>(baseUrlVentas + q).then((respuesta) => respuesta.datos.map(agenteDesdeAgenteApi));
}