import { RestAPI } from "../../comun/api/rest_api.ts";
import { Filtro, Orden } from "../../comun/diseño.ts";
import { criteriaQuery } from "../../comun/infraestructura.ts";
import { OportunidadVenta } from "../oportunidadventa/diseño.ts";
import { Cliente, GetCliente, PatchCliente } from "./diseño.ts";


const baseUrlVentas = `/ventas/cliente`;

type ClienteApi = Cliente;

const clienteFromAPI = (c: ClienteApi): Cliente => ({
  ...c,
});


export const getCliente: GetCliente = async (id) =>
  await RestAPI.get<{ datos: Cliente }>(`${baseUrlVentas}/${id}`).then((respuesta) => clienteFromAPI(respuesta.datos));

export const getClientes = async (filtro: Filtro, orden: Orden): Promise<Cliente[]> => {
  const q = criteriaQuery(filtro, orden);
  return RestAPI.get<{ datos: ClienteApi[] }>(baseUrlVentas + q).then((respuesta) => respuesta.datos.map(clienteFromAPI));
}

export const patchCliente: PatchCliente = async (id, cliente) =>
  await RestAPI.patch(`${baseUrlVentas}/${id}`, {
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
  await RestAPI.delete(`${baseUrlVentas}/${id}`);

export const getOportunidadesVentaCliente = async (filtro: Filtro, orden: Orden): Promise<OportunidadVenta[]> => {
  const q = criteriaQuery(filtro, orden);
  return RestAPI.get<{ datos: OportunidadVenta[] }>(`/crm/oportunidad_venta` + q).then((respuesta) => respuesta.datos);
};
// export const getOportunidadesVentaCliente = async (id: string, filtro: Filtro, orden: Orden): Promise<OportunidadVenta[]> => {
//   const q = criteriaQuery(filtro, orden);
//   return RestAPI.get<{ datos: OportunidadVenta[] }>(`/crm/oportunidad_venta` + q)
//     .then((respuesta) => respuesta.datos);
// }