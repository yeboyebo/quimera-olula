import { RestAPI } from "@olula/lib/api/rest_api.ts";

export const getReportOrdenCarga = idOrden =>
  RestAPI.blob(
    `/produccion/orden_carga/${idOrden}/report`,
    "Error al obtener el informe de la orden de carga"
  );
