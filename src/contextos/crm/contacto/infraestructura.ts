import { RestAPI } from "../../comun/api/rest_api.ts";
import { Filtro, FiltroAPI, Orden, OrdenAPI } from "../../comun/diseño.ts";
import { criteriaQuery } from "../../comun/infraestructura.ts";
import { Cliente } from "../cliente/diseño.ts";
import { ClienteApi, getClientes } from "../cliente/infraestructura.ts";
import { OportunidadVenta } from "../oportunidadventa/diseño.ts";
import { Contacto } from "./diseño.ts";

const baseUrlContactos = `/crm/contacto`;
const baseUrlOportunidadVenta = `/crm/oportunidad_venta`;
const baseUrlVentasCliente = `/ventas/cliente`;

type ContactoApi = Contacto;

const contactoFromAPI = (c: ContactoApi): Contacto => ({
  ...c,
});

export const getContacto = async (id: string): Promise<Contacto> =>
  await RestAPI.get<{ datos: Contacto }>(`${baseUrlContactos}/${id}`).then((respuesta) => contactoFromAPI(respuesta.datos));

export const getContactos = async (filtro: Filtro, orden: Orden): Promise<Contacto[]> => {
  const q = criteriaQuery(filtro, orden);
  return RestAPI.get<{ datos: ContactoApi[] }>(baseUrlContactos + q).then((respuesta) => respuesta.datos.map(contactoFromAPI));
}

export const patchContacto = async (id: string, contacto: Contacto) =>
  await RestAPI.patch(`${baseUrlContactos}/${id}`, {
    cambios: {
      nombre: contacto.nombre,
      email: contacto.email,
    },
  });

export const deleteContacto = async (id: string): Promise<void> =>
  await RestAPI.delete(`${baseUrlContactos}/${id}`);

export const getOportunidadesVentaContacto = async (contactoId: string): Promise<OportunidadVenta[]> => {
  const filtro: Filtro = { contacto_id: { LIKE: contactoId } };
  const orden: Orden = { id: "DESC" };
  return RestAPI.get<{ datos: OportunidadVenta[] }>(
    baseUrlOportunidadVenta + criteriaQuery(filtro, orden)
  ).then((respuesta) => respuesta.datos);
};

export const getClientesPorContacto = async (contactoId: string): Promise<Cliente[]> => {
  const filtro: Filtro = { contacto_id: { LIKE: contactoId } };
  const orden: Orden = { id: "DESC" };
  return getClientes(filtro, orden);
};