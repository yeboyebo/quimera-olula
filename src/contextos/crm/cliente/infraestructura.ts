import { RestAPI } from "../../comun/api/rest_api.ts";
import { Filtro, Orden, Paginacion, RespuestaLista } from "../../comun/diseño.ts";
import { criteriaQuery, criteriaQueryUrl } from "../../comun/infraestructura.ts";
import { Accion } from "../accion/diseño.ts";
import { NuevaOportunidadVenta, OportunidadVenta } from "../oportunidadventa/diseño.ts";
import { Cliente, GetCliente, PatchCliente } from "./diseño.ts";


const baseUrlVentasCliente = `/ventas/cliente`;
const baseUrlOportunidadVenta = `/crm/oportunidad_venta`;
const baseUrlCrm = `/crm`;
const baseUrlAccion = `/crm/accion`;

export type ClienteApi = Cliente;

const clienteFromAPI = (c: ClienteApi): Cliente => ({
  ...c,
});


export const getCliente: GetCliente = async (id) =>
  await RestAPI.get<{ datos: Cliente }>(`${baseUrlVentasCliente}/${id}`).then((respuesta) => clienteFromAPI(respuesta.datos));

// export const getClientes = async (filtro: Filtro, orden: Orden): Promise<Cliente[]> => {
//   const q = criteriaQuery(filtro, orden);
//   return RestAPI.get<{ datos: ClienteApi[] }>(baseUrlVentasCliente + q).then((respuesta) => respuesta.datos.map(clienteFromAPI));
// }

export const getClientes = async (
  filtro: Filtro,
  orden: Orden,
  paginacion?: Paginacion
): RespuestaLista<Cliente> => {
  const q = criteriaQuery(filtro, orden, paginacion);

  const respuesta = await RestAPI.get<{ datos: ClienteApi[]; total: number }>(baseUrlVentasCliente + q);
  return { datos: respuesta.datos.map(clienteFromAPI), total: respuesta.total };
};


export const patchCliente: PatchCliente = async (id, cliente) =>
  await RestAPI.patch(`${baseUrlVentasCliente}/${id}`, {
    cambios: {
      nombre: cliente.nombre,
      id_fiscal: {
        id: cliente.id_fiscal,
        tipo: cliente.tipo_id_fiscal,
      },
      grupo_iva_negocio_id: cliente.grupo_iva_negocio_id,
      nombre_comercial: cliente.nombre_comercial,
      web: cliente.web,
      telefono1: cliente.telefono1,
      telefono2: cliente.telefono2,
      email: cliente.email,
      observaciones: cliente.observaciones,
      grupo_id: cliente.grupo_id,
    },
  });

export const deleteCliente = async (id: string): Promise<void> =>
  await RestAPI.delete(`${baseUrlVentasCliente}/${id}`);

export const getOportunidadesVentaCliente = async (clienteId: string): Promise<OportunidadVenta[]> =>
  await RestAPI.get<{ datos: OportunidadVenta[] }>(`/crm/cliente/${clienteId}/oportunidades_venta`).then((respuesta) => respuesta.datos);


export const getOportunidadVenta = async (id: string): Promise<OportunidadVenta> =>
  await RestAPI.get<{ datos: OportunidadVenta }>(`${baseUrlOportunidadVenta}/${id}`).then((respuesta) => respuesta.datos);

export const postOportunidadVenta = async (oportunidad: NuevaOportunidadVenta): Promise<string> => {
  return await RestAPI.post(baseUrlOportunidadVenta, oportunidad).then((respuesta) => respuesta.id);
};

export const vincularContactoCliente = async (contactoId: string, clienteId: string): Promise<void> => {
  const payload = {
    contacto_id: contactoId,
  };
  await RestAPI.patch(`${baseUrlCrm}/cliente/${clienteId}/vincular_contacto`, payload);
};

export const desvincularContactoCliente = async (contactoId: string, clienteId: string): Promise<void> => {
  const payload = {
    contacto_id: contactoId,
  };
  await RestAPI.patch(`${baseUrlCrm}/cliente/${clienteId}/desvincular_contacto`, payload);
};

export const getAccionesCliente = async (clienteId: string) => {
  const filtro = ['cliente_id', clienteId] as unknown as Filtro;

  const orden = [] as Orden;

  const q = criteriaQueryUrl(filtro, orden);
  return RestAPI.get<{ datos: Accion[] }>(baseUrlAccion + q).then((respuesta) => respuesta.datos);
};