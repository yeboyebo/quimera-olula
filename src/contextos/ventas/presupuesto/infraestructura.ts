

import { CampoFormularioGenerico, OpcionCampo } from "../../../componentes/detalle/FormularioGenerico.tsx";
import { RestAPI } from "../../comun/api/rest_api.ts";
import { CambiarArticuloLinea, CambiarCantidadLinea, DeleteLinea, GetPresupuesto, GetPresupuestos, LineaPresupuesto, PatchCambiarDivisa, PostLinea, Presupuesto } from "./diseño.ts";

const baseUrl = `/ventas/presupuesto`;

type PresupuestoAPI = Presupuesto
type LineaPresupuestoAPI = LineaPresupuesto

export const presupuestoFromAPI = (p: PresupuestoAPI): Presupuesto => p;
export const lineaPresupuestoFromAPI = (l: LineaPresupuestoAPI): LineaPresupuesto => l;

export const getPresupuesto: GetPresupuesto = async (id) =>
  RestAPI.get<{ datos: Presupuesto }>(`${baseUrl}/${id}`).then((respuesta) => {
    return presupuestoFromAPI(respuesta.datos);
  });

export const getPresupuestos: GetPresupuestos = async (_, __) => {
  return RestAPI.get<{ datos: Presupuesto[] }>(`${baseUrl}`).then((respuesta) => {
    return respuesta.datos.map((d) => presupuestoFromAPI(d));
  });
}

export const patchCambiarAgente = async (id: string, agenteId: string) => {
  await RestAPI.patch(`${baseUrl}/${id}/cambiar_agente`, { agente_id: agenteId });
}

export const patchCambiarDivisa: PatchCambiarDivisa = async (id, divisaId) => {
  await RestAPI.patch(`${baseUrl}/${id}/cambiar_divisa`, { divisa_id: divisaId });
}

export const patchCambiarCliente = async (id: string, clienteId: string, dirClienteId: string): Promise<void> => {
  await RestAPI.patch(`${baseUrl}/${id}/cambiar_cliente`, {
    cliente: {
      id: clienteId,
      direccion_id: dirClienteId
    }
  });
}
export const obtenerOpcionesSelector =
  (path: string) => async () =>
    RestAPI.get<{ datos: [] }>(
      `/cache/comun/${path}`
    ).then((respuesta) => respuesta.datos.map(({ descripcion, ...resto }: Record<string, string>) => [Object.values(resto).at(0), descripcion] as OpcionCampo));

const opcionesDivisa = await obtenerOpcionesSelector("divisa")();

export const getLineas = async (id: string): Promise<LineaPresupuesto[]> =>
  await RestAPI.get<{ datos: LineaPresupuestoAPI[] }>(`${baseUrl}/${id}/linea`).then((respuesta) => {
    const lineas = respuesta.datos.map((d) => lineaPresupuestoFromAPI(d));
    return lineas
  });


export const postLinea: PostLinea = async (id, linea) => {
  return await RestAPI.post(`${baseUrl}/${id}/linea`, {
    lineas: [{
      articulo_id: linea.referencia,
      cantidad: linea.cantidad
    }]
  }).then((respuesta) => {
    return respuesta.id;
  });
}

export const patchArticuloLinea: CambiarArticuloLinea = async (id, lineaId, referencia) => {
  await RestAPI.patch(`${baseUrl}/${id}/linea/${lineaId}/cambiar_articulo`, {
    articulo_id: referencia
  });
}

export const patchCantidadLinea: CambiarCantidadLinea = async (id, lineaId, cantidad) => {
  await RestAPI.patch(`${baseUrl}/${id}/cambiar_cantidad_lineas`, {
    lineas: [{ linea_id: lineaId, cantidad: cantidad }]
  });
}

export const deleteLinea: DeleteLinea = async (id: string, lineaId: string): Promise<void> => {
  await RestAPI.patch(`${baseUrl}/${id}/borrar_lineas`, {
    lineas: [lineaId]
  });
}

export const camposPresupuesto: Record<string, CampoFormularioGenerico> = {
  "id": { nombre: "id", etiqueta: "Código", tipo: "text", oculto: true },
  "codigo": { nombre: "codigo", etiqueta: "Código", tipo: "text" },
  "fecha": { nombre: "fecha", etiqueta: "Fecha", tipo: "date" },
  "cliente_id": { nombre: "cliente_id", etiqueta: "ID Cliente", tipo: "text" },
  "nombre_cliente": { nombre: "nombre_cliente", etiqueta: "Nombre Cliente", tipo: "text" },
  "id_fiscal": { nombre: "id_fiscal", etiqueta: "ID Fiscal", tipo: "text" },
  "direccion_id": { nombre: "direccion_id", etiqueta: "ID Dirección", tipo: "text" },
  "agente_id": { nombre: "agente_id", etiqueta: "ID Agente", tipo: "text" },
  "divisa_id": { nombre: "divisa_id", etiqueta: "Divisa", tipo: "text", opciones: opcionesDivisa },
};

export const camposLinea: Record<string, CampoFormularioGenerico> = {
  "id": { nombre: "id", etiqueta: "ID", tipo: "text", oculto: true },
  "referencia": { nombre: "referencia", etiqueta: "Referencia", tipo: "text" },
  "descripcion": { nombre: "descripcion", etiqueta: "Descripción", tipo: "text" },
  "cantidad": { nombre: "cantidad", etiqueta: "Cantidad", tipo: "number" },
  "pvp_unitario": { nombre: "pvp_unitario", etiqueta: "PVP Unitario", tipo: "number" },
  "pvp_total": { nombre: "pvp_total", etiqueta: "PVP Total", tipo: "number" },
};

