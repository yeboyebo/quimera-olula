import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { Filtro, Orden, Paginacion, RespuestaLista } from "@olula/lib/diseño.ts";
import { criteriaQuery, criteriaQueryUrl } from "@olula/lib/infraestructura.ts";
import { Accion } from "../accion/diseño.ts";
import { Cliente } from "../cliente/diseño.ts";
import ApiUrls from "../comun/urls.ts";
import { OportunidadVenta } from "../oportunidadventa/diseño.ts";

import { Contacto } from "./diseño.ts";


const baseUrlContactos = new ApiUrls().CONTACTO;
const baseUrlAccion = new ApiUrls().ACCION;
const baseUrlOportunidadVenta = new ApiUrls().OPORTUNIDAD_VENTA;

type ContactoApi = Contacto;

const contactoFromAPI = (c: ContactoApi): Contacto => ({
  ...c,
});

const contactoToAPI = (c: Contacto): ContactoApi => ({
  ...c,
});



export const getContacto = async (id: string): Promise<Contacto> =>
  await RestAPI.get<{ datos: Contacto }>(`${baseUrlContactos}/${id}`).then((respuesta) => contactoFromAPI(respuesta.datos));

export const getContactos = async (
  filtro: Filtro,
  orden: Orden,
  paginacion: Paginacion
): RespuestaLista<Contacto> => {
  const q = criteriaQuery(filtro, orden, paginacion);

  const respuesta = await RestAPI.get<{ datos: Contacto[]; total: number }>(baseUrlContactos + q);
  return { datos: respuesta.datos.map(contactoFromAPI), total: respuesta.total };
};

export const patchContacto = async (id: string, contacto: Contacto) =>
  await RestAPI.patch(`${baseUrlContactos}/${id}`, contacto, "Error al guardar contacto");

export const postContacto = async (contacto: Partial<Contacto>): Promise<string> => {
  return await RestAPI.post(baseUrlContactos, contactoToAPI(contacto as Contacto), "Error al guardar contacto").then(
    (respuesta) => respuesta.id
  );
};

export const deleteContacto = async (id: string): Promise<void> =>
  await RestAPI.delete(`${baseUrlContactos}/${id}`, "Error al borrar contacto");


export const getOportunidadesVentaContacto = async (contactoId: string) => {
  const filtro = ['contacto_id', contactoId] as unknown as Filtro;

  const orden = [] as Orden;

  const q = criteriaQueryUrl(filtro, orden);
  return RestAPI.get<{ datos: OportunidadVenta[], total: number }>(baseUrlOportunidadVenta + q).then((respuesta) => respuesta);
};

export const getClientesPorContacto = async (contactoId: string) =>
  await RestAPI.get<{ datos: Cliente[], total: number }>(`/crm/contacto/${contactoId}/clientes`).then((respuesta) => respuesta);

export const getAccionesContacto = async (contactoId: string) => {
  const filtro = ['contacto_id', contactoId] as unknown as Filtro;

  const orden = [] as Orden;

  const q = criteriaQueryUrl(filtro, orden);
  return RestAPI.get<{ datos: Accion[], total: number }>(baseUrlAccion + q).then((respuesta) => respuesta);
};
