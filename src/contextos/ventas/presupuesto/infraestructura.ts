import { RestAPI } from "../../comun/api/rest_api.ts";
import { Presupuesto } from "./diseño.ts";

export const obtenerTodosLosPresupuestos = async () =>
  RestAPI.get<{ presupuestos: Presupuesto[] }>("/ventas/presupuesto").then((respuesta) => {
    console.log("respuesta get", respuesta);
    return respuesta.presupuestos;
  });

export const obtenerUnPresupuesto = async (id: string) =>
  RestAPI.get<Presupuesto>(`/ventas/presupuesto/${id}`);

export const crearPresupuesto = async (presupuesto: Presupuesto) =>
  RestAPI.post(`/ventas/presupuesto`, presupuesto).then((respuesta) => {
    console.log("respuesta", respuesta);
    // return respuesta.entidad as Presupuesto
  });

export const actualizarPresupuesto = async (
  id: string,
  presupuesto: Partial<Presupuesto>
) => {
  console.log("patch", presupuesto);
  return RestAPI.patch(`/ventas/presupuesto/${id}`, presupuesto);
};

export const eliminarPresupuesto = async (id: string) =>
  RestAPI.delete(`/quimera/ventas/presupuesto/${id}`);

export const accionesPresupuesto = {
  obtenerTodos: obtenerTodosLosPresupuestos,
  obtenerUno: obtenerUnPresupuesto,
  crearUno: crearPresupuesto,
  actualizarUno: actualizarPresupuesto,
  eliminarUno: eliminarPresupuesto,
};
