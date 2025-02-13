import { RestAPI } from "../../comun/api/rest_api.ts";
import { Cliente, ClienteConDirecciones } from "./diseño.ts";

export const obtenerTodosLosClientes = async () =>
  RestAPI.get<{ clientes: Cliente[] }>("/ventas/cliente").then(
    (respuesta) => {
      console.log('respuesta get', respuesta);
      return respuesta.clientes
    });

export const obtenerUnCliente = async (id: string) =>
  RestAPI.get<ClienteConDirecciones>(`/ventas/cliente/${id}`);

// export const crearCliente = async (cliente: Cliente) =>
//   RestAPI.post(`/quimera/ventas/cliente/${cliente.id}`, cliente);
export const crearCliente = async (cliente: Cliente) =>
  RestAPI.post(`/ventas/cliente`, cliente).then((respuesta) => {
    console.log('respuesta', respuesta);
    return respuesta.entidad
  });

export const actualizarCliente = async (
  cliente: Partial<ClienteConDirecciones>
) => {
  console.log('patch', cliente)
  return RestAPI.patch(`/ventas/cliente/${cliente.id}`, cliente);
}
  





export const eliminarCliente = async (id: string) =>
  RestAPI.delete(`/quimera/ventas/cliente/${id}`);

export const accionesCliente = {
  obtenerTodos: obtenerTodosLosClientes,
  obtenerUno: obtenerUnCliente,
  crearUno: crearCliente,
  actualizarUno: actualizarCliente,
  eliminarUno: eliminarCliente,
};
