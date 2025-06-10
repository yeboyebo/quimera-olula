import { RestAPI } from "../../comun/api/rest_api.ts";
import { Filtro, Orden } from "../../comun/diseño.ts";
import { criteriaQuery } from "../../comun/infraestructura.ts";
import { Cliente } from "../cliente/diseño.ts";
import { getClientes } from "../cliente/infraestructura.ts";
import {
  getOportunidadesVenta
} from "../oportunidadventa/infraestructura.ts";
import { Contacto } from "./diseño.ts";


const baseUrlContactos = `/crm/contacto`;

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

export const getOportunidadesVentaContacto = async (contactoId: string) => {
  const filtro = { contacto_id: { "LIKE": contactoId } };
  const orden = { id: "DESC" };
  return getOportunidadesVenta(filtro as unknown as Filtro, orden as Orden);
};

export const getClientesPorContacto = async (contactoId: string): Promise<Cliente[]> => {
  const filtro = { contacto_id: contactoId };
  const orden = { id: "DESC" };
  return getClientes(filtro as unknown as Filtro, orden as Orden);
};