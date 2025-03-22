

import { CampoFormularioGenerico } from "../../../componentes/detalle/FormularioGenerico.tsx";
import { RestAPI } from "../../comun/api/rest_api.ts";
import { crearAcciones } from "../../comun/infraestructura.ts";
import { GetPresupuesto, GetPresupuestos, Presupuesto } from "./diseño.ts";

const baseUrl = `/ventas/presupuesto`;

type PresupuestoApi = Presupuesto

export const accionesPresupuesto = crearAcciones<Presupuesto>("presupuesto");

export const getPresupuestos: GetPresupuestos = async (filtro, orden) => {
  (filtro && orden) ? 'usar' : 'params'
  return RestAPI.get<{ datos: Presupuesto[] }>(`${baseUrl}`).then((respuesta) => {
    return respuesta.datos.map((d) => presupuestoFromAPI(d));
  });
}

export const presupuestoFromAPI = (p: PresupuestoApi): Presupuesto => p;

export const getPresupuesto: GetPresupuesto = async (id) =>
  RestAPI.get<{ datos: Presupuesto }>(`${baseUrl}/${id}`).then((respuesta) => {
    return presupuestoFromAPI(respuesta.datos);
  });

export const camposLineasPresupuestoAlta: CampoFormularioGenerico[] = [
  { nombre: "articulo_id", etiqueta: "Referencia", tipo: "text" },
  { nombre: "cantidad", etiqueta: "Cantidad", tipo: "number" },
];

// export const camposPresupuesto: CampoFormularioGenerico[] = [
//   { nombre: "id", etiqueta: "Código", tipo: "text", oculto: true },
//   { nombre: "codigo", etiqueta: "Código", tipo: "text" },
//   { nombre: "fecha", etiqueta: "Fecha", tipo: "date" },
//   { nombre: "cliente_id", etiqueta: "ID Cliente", tipo: "text" },
//   { nombre: "nombre_cliente", etiqueta: "Nombre Cliente", tipo: "text" },
//   { nombre: "id_fiscal", etiqueta: "ID Fiscal", tipo: "text" },
//   { nombre: "direccion_id", etiqueta: "ID Dirección", tipo: "text" },
// ];
export const camposPresupuesto: Record<string, CampoFormularioGenerico> = {
  "id": { nombre: "id", etiqueta: "Código", tipo: "text", oculto: true },
  "codigo": { nombre: "codigo", etiqueta: "Código", tipo: "text" },
  "fecha": { nombre: "fecha", etiqueta: "Fecha", tipo: "date" },
  "cliente_id": { nombre: "cliente_id", etiqueta: "ID Cliente", tipo: "text" },
  "nombre_cliente": { nombre: "nombre_cliente", etiqueta: "Nombre Cliente", tipo: "text" },
  "id_fiscal": { nombre: "id_fiscal", etiqueta: "ID Fiscal", tipo: "text" },
  "direccion_id": { nombre: "direccion_id", etiqueta: "ID Dirección", tipo: "text" },
};


export const camposLineasPresupuesto: CampoFormularioGenerico[] = [
  { nombre: "id", etiqueta: "ID", tipo: "text", oculto: true },
  { nombre: "referencia", etiqueta: "Referencia", tipo: "text" },
  { nombre: "descripcion", etiqueta: "Descripción", tipo: "text" },
  { nombre: "cantidad", etiqueta: "Cantidad", tipo: "number" },
  { nombre: "pvp_unitario", etiqueta: "PVP Unitario", tipo: "number" },
  { nombre: "pvp_total", etiqueta: "PVP Total", tipo: "number" },
];

export const camposPresupuestoNuevo: CampoFormularioGenerico[] = [
  { nombre: "cliente_id", etiqueta: "ID Cliente", tipo: "text" },
  { nombre: "direccion_id", etiqueta: "ID Dirección", tipo: "text" },
  { nombre: "empresa_id", etiqueta: "ID Empresa", tipo: "text" },
];