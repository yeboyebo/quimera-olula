import { RestAPI } from "../../comun/api/rest_api.ts";
import { Filtro, Orden } from "../../comun/diseño.ts";
import { criteriaQuery } from "../../comun/infraestructura.ts";
import { Agente } from "./diseño.ts";

const baseUrlVentas = `/ventas/agente`;
type AgenteApi = Agente;

const agenteDesdeAgenteApi = (a: AgenteApi): Agente => a

export const getAgentes = async (filtro: Filtro, orden: Orden): Promise<Agente[]> => {
    const q = criteriaQuery(filtro, orden);

    return RestAPI.get<{ datos: AgenteApi[] }>(baseUrlVentas + q).then((respuesta) => respuesta.datos.map(agenteDesdeAgenteApi));
}