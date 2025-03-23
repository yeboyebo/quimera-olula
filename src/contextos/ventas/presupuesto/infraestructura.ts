

import { CampoFormularioGenerico } from "../../../componentes/detalle/FormularioGenerico.tsx";
import { RestAPI } from "../../comun/api/rest_api.ts";
import { crearAcciones } from "../../comun/infraestructura.ts";
import { CambiarArticuloLinea, DeleteLinea, GetPresupuesto, GetPresupuestos, LineaPresupuesto, PostLinea, Presupuesto } from "./diseño.ts";

const baseUrl = `/ventas/presupuesto`;

type PresupuestoAPI = Presupuesto
type LineaPresupuestoAPI = LineaPresupuesto

export const accionesPresupuesto = crearAcciones<Presupuesto>("presupuesto");

export const getPresupuestos: GetPresupuestos = async (filtro, orden) => {
  (filtro && orden) ? 'usar' : 'params'
  return RestAPI.get<{ datos: Presupuesto[] }>(`${baseUrl}`).then((respuesta) => {
    return respuesta.datos.map((d) => presupuestoFromAPI(d));
  });
}

export const presupuestoFromAPI = (p: PresupuestoAPI): Presupuesto => p;

export const getPresupuesto: GetPresupuesto = async (id) =>
  RestAPI.get<{ datos: Presupuesto }>(`${baseUrl}/${id}`).then((respuesta) => {
    return presupuestoFromAPI(respuesta.datos);
  });

export const patchCambiarAgente = async (id: string, agenteId: string) => {
  await RestAPI.patch(`${baseUrl}/${id}/cambiar_agente`, { agente_id: agenteId });
}

export const patchCambiarCliente = async (id: string, clienteId: string, dirClienteId: string): Promise<void> => {
  await RestAPI.patch(`${baseUrl}/${id}/cambiar_cliente`, {
    cliente: {
      id: clienteId,
      direccion_id: dirClienteId
    }
  });
}

export const lineaPresupuestoFromAPI = (l: LineaPresupuestoAPI): LineaPresupuesto => l;

export const getLineas = async (id: string): Promise<LineaPresupuesto[]> =>
  await RestAPI.get<{ datos: LineaPresupuestoAPI[] }>(`${baseUrl}/${id}/linea`).then((respuesta) => {
    const lineas = respuesta.datos.map((d) => lineaPresupuestoFromAPI(d));
    return lineas
  });


export const postLinea: PostLinea = async (id, linea) => {
  const payload = {
    lineas: [{
      articulo_id: linea.referencia,
      cantidad: linea.cantidad
    }]
  }
  return await RestAPI.post(`${baseUrl}/${id}/linea`, payload).then((respuesta) => {
    return respuesta.id;
  });
}

export const patchArticuloLinea: CambiarArticuloLinea = async (id, lineaId, referencia) => {
  await RestAPI.patch(`${baseUrl}/${id}/linea/${lineaId}/cambiar_articulo`, {
    articulo_id: referencia
  });
}

export const deleteLinea: DeleteLinea = async (id: string, lineaId: string): Promise<void> => {
  const payload = {
    lineas: [lineaId]
  };
  await RestAPI.patch(`${baseUrl}/${id}/borrar_lineas`, payload);
}


export const camposLineasPresupuestoAlta: CampoFormularioGenerico[] = [
  { nombre: "articulo_id", etiqueta: "Referencia", tipo: "text" },
  { nombre: "cantidad", etiqueta: "Cantidad", tipo: "number" },
];


export const camposPresupuesto: Record<string, CampoFormularioGenerico> = {
  "id": { nombre: "id", etiqueta: "Código", tipo: "text", oculto: true },
  "codigo": { nombre: "codigo", etiqueta: "Código", tipo: "text" },
  "fecha": { nombre: "fecha", etiqueta: "Fecha", tipo: "date" },
  "cliente_id": { nombre: "cliente_id", etiqueta: "ID Cliente", tipo: "text" },
  "nombre_cliente": { nombre: "nombre_cliente", etiqueta: "Nombre Cliente", tipo: "text" },
  "id_fiscal": { nombre: "id_fiscal", etiqueta: "ID Fiscal", tipo: "text" },
  "direccion_id": { nombre: "direccion_id", etiqueta: "ID Dirección", tipo: "text" },
  "agente_id": { nombre: "agente_id", etiqueta: "ID Agente", tipo: "text" },
};

export const camposLinea: Record<string, CampoFormularioGenerico> = {
  "id": { nombre: "id", etiqueta: "ID", tipo: "text", oculto: true },
  "referencia": { nombre: "referencia", etiqueta: "Referencia", tipo: "text" },
  "descripcion": { nombre: "descripcion", etiqueta: "Descripción", tipo: "text" },
  "cantidad": { nombre: "cantidad", etiqueta: "Cantidad", tipo: "number" },
  "pvp_unitario": { nombre: "pvp_unitario", etiqueta: "PVP Unitario", tipo: "number" },
  "pvp_total": { nombre: "pvp_total", etiqueta: "PVP Total", tipo: "number" },
};


export const camposPresupuestoNuevo: CampoFormularioGenerico[] = [
  { nombre: "cliente_id", etiqueta: "ID Cliente", tipo: "text" },
  { nombre: "direccion_id", etiqueta: "ID Dirección", tipo: "text" },
  { nombre: "empresa_id", etiqueta: "ID Empresa", tipo: "text" },
];