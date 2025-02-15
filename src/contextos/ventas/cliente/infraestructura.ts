import { RestAPI } from "../../comun/api/rest_api.ts";
import {
  Cliente,
  ClienteConDirecciones,
  Direccion,
  DireccionCliente,
} from "./diseño.ts";

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
  

export const obtenerDireccionesCliente = async (clienteId: string) =>
  RestAPI.get<{ direcciones_cliente: ClienteConDirecciones }>(
    // `/ventas/cliente/${clienteId}/direcciones`
    `/ventas/direcciones_cliente/${clienteId}`
  ).then(
    (respuesta) => {
      console.log('respuesta get direcciones', respuesta);
      return respuesta.direcciones_cliente.direcciones
    });

export const obtenerDireccionCliente = (clienteId: string) =>
  async (dirClienteId: string) =>
  RestAPI.get<{ direccion: DireccionCliente }>(
    // `/ventas/cliente/${id}/direcciones`
    `/ventas/cliente/${clienteId}/direccion/${dirClienteId}`
  ).then(
    (respuesta) => {
      console.log('respuesta get direccion', respuesta);
      return respuesta.direccion
    });

export const crearDireccionCliente = (clienteId: string) =>
  async (direccion: Direccion) =>
    RestAPI.patch(
    // `/ventas/cliente/${id}/direcciones` ??
    `/ventas/direcciones_cliente/${clienteId}/crear_direccion`,
    {direccion},
  )

export const cambiarDireccionCliente =  (clienteId: string) =>
  async (dirCliente: DireccionCliente) =>
    RestAPI.patch(
    `/ventas/cliente/${clienteId}/direccion/${dirCliente.id}`,
    {
      direccion: {
        nombre_via: dirCliente.direccion.nombre_via,
        tipo_via: dirCliente.direccion.tipo_via,
        numero: dirCliente.direccion.numero,
        otros: dirCliente.direccion.otros,
        cod_postal: dirCliente.direccion.cod_postal,
        ciudad: dirCliente.direccion.ciudad,
        provincia_id: dirCliente.direccion.provincia_id,
        provincia: dirCliente.direccion.provincia,
        pais_id: dirCliente.direccion.pais_id,
        apartado: dirCliente.direccion.apartado,
        telefono: dirCliente.direccion.telefono,
      }
    }
  )

  // nombre_via: str
  //   tipo_via: str | None
  //   numero: str | None
  //   otros: str | None
  //   cod_postal: str | None
  //   ciudad: str
  //   provincia_id: str | None
  //   provincia: str | None
  //   pais_id: str | None
  //   pais: str | None
  //   apartado: str | None
  //   telefono: str | None
export const eliminarCliente = async (id: string) =>
  RestAPI.delete(`/quimera/ventas/cliente/${id}`);

export const accionesCliente = {
  obtenerTodos: obtenerTodosLosClientes,
  obtenerUno: obtenerUnCliente,
  crearUno: crearCliente,
  actualizarUno: actualizarCliente,
  eliminarUno: eliminarCliente,
};
