import { RestAPI } from "../../comun/api/rest_api.ts";
import { Cliente, ClienteConDirecciones } from "./diseño.ts";

export const obtenerTodosLosClientes = async () =>
  RestAPI.get<{ clientes: Cliente[] }>("/quimera/ventas/cliente").then(
    (respuesta) => respuesta.clientes
  );

export const obtenerUnCliente = async (id: string) =>
  RestAPI.get<ClienteConDirecciones>(`/quimera/ventas/cliente/${id}`);

export const crearCliente = async (cliente: Cliente) =>
  RestAPI.post(`/quimera/ventas/cliente/${cliente.id}`, cliente);

export const actualizarCliente = async (
  cliente: Partial<ClienteConDirecciones>
) => RestAPI.patch(`/quimera/ventas/cliente/${cliente.id}`, cliente);

export const eliminarCliente = async (id: string) =>
  RestAPI.delete(`/quimera/ventas/cliente/${id}`);

export const accionesCliente = {
  obtenerTodos: obtenerTodosLosClientes,
  obtenerUno: obtenerUnCliente,
  crearUno: crearCliente,
  actualizarUno: actualizarCliente,
  eliminarUno: eliminarCliente,
};
