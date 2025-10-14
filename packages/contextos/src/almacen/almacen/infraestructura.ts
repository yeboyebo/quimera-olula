import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { Filtro, Orden } from "@olula/lib/diseño.ts";
import { criteriaQuery } from "@olula/lib/infraestructura.ts";
import { Almacen } from "./diseño.ts";

const baseUrlAlmacen = `/almacen/almacen`;

type AlmacenApi = Almacen;

const almacenDesdeApi = (t: AlmacenApi): Almacen => t;

export const obtenerAlmacenes = async (filtro: Filtro, orden: Orden): Promise<Almacen[]> => {
    const q = criteriaQuery(filtro, orden);

    return RestAPI.get<{ datos: AlmacenApi[] }>(baseUrlAlmacen + q).then((respuesta) => respuesta.datos.map(almacenDesdeApi));
}
