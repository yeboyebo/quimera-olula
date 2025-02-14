import { RestAPI } from "../../comun/api/rest_api.ts";
import { Cliente, ClienteConDirecciones, Direccion } from "./diseño.ts";

export const obtenerTodosLosClientes = async () =>
  RestAPI.get<{ clientes: Cliente[] }>("/ventas/cliente").then(
    (respuesta) => {
      console.log('respuesta get', respuesta);
      return respuesta.clientes
    });

export const obtenerUnCliente = async (id: string) =>
  RestAPI.get<Cliente>(`/ventas/cliente/${id}`);

// export const crearCliente = async (cliente: Cliente) =>
//   RestAPI.post(`/quimera/ventas/cliente/${cliente.id}`, cliente);
export const crearCliente = async (cliente: Cliente) =>
  RestAPI.post(`/ventas/cliente`, cliente).then((respuesta) => {
    console.log('respuesta', respuesta);
    return respuesta.entidad as Cliente
  });

export const actualizarCliente = async (
  cliente: Partial<Cliente>
) => {
  console.log('patch', cliente)
  return RestAPI.patch(`/ventas/cliente/${cliente.id}`, cliente);
}
  

export const obtenerDireccionesCliente = async (id: string) =>
  RestAPI.get<{ direcciones_cliente: ClienteConDirecciones }>(
    // `/ventas/cliente/${id}/direcciones`
    `/ventas/direcciones_cliente/${id}`
  ).then(
    (respuesta) => {
      console.log('respuesta get direcciones', respuesta);
      return respuesta.direcciones_cliente.direcciones
    });

export const crearDireccionCliente =  (id: string) =>
  async (direccion: Direccion) =>
    RestAPI.patch(
    // `/ventas/cliente/${id}/direcciones` ??
    `/ventas/direcciones_cliente/${id}/crear_direccion`,
    {direccion},
  )

export const eliminarCliente = async (id: string) =>
  RestAPI.delete(`/quimera/ventas/cliente/${id}`);

export const accionesCliente = {
  obtenerTodos: obtenerTodosLosClientes,
  obtenerUno: obtenerUnCliente,
  crearUno: crearCliente,
  actualizarUno: actualizarCliente,
  eliminarUno: eliminarCliente,
};
