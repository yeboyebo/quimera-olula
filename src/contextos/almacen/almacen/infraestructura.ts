import { RestAPI } from "../../comun/api/rest_api.ts";
import { Filtro, Orden } from "../../comun/diseño.ts";
import { criteriaQuery } from "../../comun/infraestructura.ts";
import { Almacen } from "./diseño.ts";

const baseUrlAlmacen = `/almacen/almacen`;

type AlmacenApi = Almacen;

const almacenDesdeApi = (t: AlmacenApi): Almacen => t;

export const obtenerAlmacenes = async (filtro: Filtro, orden: Orden): Promise<Almacen[]> => {
    const q = criteriaQuery(filtro, orden);

    return RestAPI.get<{ datos: AlmacenApi[] }>(baseUrlAlmacen + q).then((respuesta) => respuesta.datos.map(almacenDesdeApi));
}
