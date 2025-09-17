import { RestAPI } from "../../comun/api/rest_api.ts";
import ApiUrls from "../../comun/api/urls.ts";
import { Filtro, Orden, Paginacion, RespuestaLista } from "../../comun/diseño.ts";
import { criteriaQuery, criteriaQueryUrl } from "../../comun/infraestructura.ts";
import { Accion } from "../accion/diseño.ts";
import { Cliente } from "../cliente/diseño.ts";
import { OportunidadVenta } from "../oportunidadventa/diseño.ts";

import { Contacto } from "./diseño.ts";


const baseUrlContactos = ApiUrls.CRM.CONTACTO;
const baseUrlAccion = ApiUrls.CRM.ACCION;
const baseUrlOportunidadVenta = ApiUrls.CRM.OPORTUNIDAD_VENTA;

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
  paginacion?: Paginacion
): RespuestaLista<Contacto> => {
  const q = criteriaQuery(filtro, orden, paginacion);

  const respuesta = await RestAPI.get<{ datos: Contacto[]; total: number }>(baseUrlContactos + q);
  return { datos: respuesta.datos.map(contactoFromAPI), total: respuesta.total };
};


export const patchContacto = async (id: string, contacto: Contacto) =>
  await RestAPI.patch(`${baseUrlContactos}/${id}`, {
    cambios: {
      nombre: contacto.nombre,
      email: contacto.email,
    },
  }, "Error al guardar contacto");

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
  return RestAPI.get<{ datos: OportunidadVenta[] }>(baseUrlOportunidadVenta + q).then((respuesta) => respuesta.datos);
};

export const getClientesPorContacto = async (contactoId: string): Promise<Cliente[]> =>
  await RestAPI.get<{ datos: Cliente[] }>(`/crm/contacto/${contactoId}/clientes`).then((respuesta) => respuesta.datos);

export const getAccionesContacto = async (contactoId: string) => {
  const filtro = ['contacto_id', contactoId] as unknown as Filtro;

  const orden = [] as Orden;

  const q = criteriaQueryUrl(filtro, orden);
  return RestAPI.get<{ datos: Accion[] }>(baseUrlAccion + q).then((respuesta) => respuesta.datos);
};
