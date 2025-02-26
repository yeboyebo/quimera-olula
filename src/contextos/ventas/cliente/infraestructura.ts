import { RestAPI } from "../../comun/api/rest_api.ts";
import { Cliente, Direccion, DireccionCliente } from "./diseño.ts";

export const obtenerTodosLosClientes = async () =>
  RestAPI.get<{ clientes: Cliente[] }>("/ventas/cliente").then((respuesta) => {
    console.log("respuesta get", respuesta);
    return respuesta.clientes;
  });

export const obtenerUnCliente = async (id: string) =>
  RestAPI.get<Cliente>(`/ventas/cliente/${id}`);

// export const crearCliente = async (cliente: Cliente) =>
//   RestAPI.post(`/quimera/ventas/cliente/${cliente.id}`, cliente);
export const crearCliente = async (cliente: Cliente) =>
  RestAPI.post(`/ventas/cliente`, cliente).then((respuesta) => {
    console.log("respuesta", respuesta);
    // return respuesta.entidad as Cliente
  });

export const actualizarCliente = async (
  id: string,
  cliente: Partial<Cliente>
) => {
  console.log("patch", cliente);
  return RestAPI.patch(`/ventas/cliente/${id}`, cliente);
};

export const obtenerDireccionesCliente = async (clienteId: string) =>
  RestAPI.get<{ direcciones: DireccionCliente[] }>(
    `/ventas/cliente/${clienteId}/direcciones`
  ).then((respuesta) => {
    return respuesta.direcciones;
  });

export const obtenerDireccionCliente =
  (clienteId: string) => async (dirClienteId: string) =>
    RestAPI.get<{ direccion: DireccionCliente }>(
      `/ventas/cliente/${clienteId}/direcciones/${dirClienteId}`
    ).then((respuesta) => {
      return respuesta.direccion;
    });

export const crearDireccionCliente =
  (clienteId: string) => async (direccion: DireccionCliente) =>
    RestAPI.post(`/ventas/cliente/${clienteId}/direcciones`, { direccion });

export const cambiarDireccionCliente =
  (clienteId: string) => async (dirClienteId: string, direccion: Direccion) =>
    RestAPI.patch(`/ventas/cliente/${clienteId}/direcciones/${dirClienteId}`, {
      direccion: {
        nombre_via: direccion.nombre_via,
        tipo_via: direccion.tipo_via,
        numero: direccion.numero,
        otros: direccion.otros,
        cod_postal: direccion.cod_postal,
        ciudad: direccion.ciudad,
        provincia_id: direccion.provincia_id,
        provincia: direccion.provincia,
        pais_id: direccion.pais_id,
        apartado: direccion.apartado,
        telefono: direccion.telefono,
        // Quitamos el nombre del país
      },
    });

export const marcarDireccionFacturacion =
  (clienteId: string) => async (dirClienteId: string) =>
    RestAPI.patch(
      `/ventas/cliente/${clienteId}/direcciones/${dirClienteId}/facturacion`,
      {}
    );

export const borrarDireccionCliente =
  (clienteId: string) => async (dirClienteId: string) =>
    RestAPI.delete(`/ventas/cliente/${clienteId}/direcciones/${dirClienteId}`);

export const eliminarCliente = async (id: string) =>
  RestAPI.delete(`/quimera/ventas/cliente/${id}`);

export const accionesCliente = {
  obtenerTodos: obtenerTodosLosClientes,
  obtenerUno: obtenerUnCliente,
  crearUno: crearCliente,
  actualizarUno: actualizarCliente,
  eliminarUno: eliminarCliente,
};

export const accionesDirCliente = {
  obtenerTodos: obtenerDireccionesCliente,
  obtenerUno: obtenerDireccionCliente,
  crearUno: crearDireccionCliente,
  actualizarUno: cambiarDireccionCliente,
  eliminarUno: borrarDireccionCliente,
  marcarFacturacion: marcarDireccionFacturacion,
};
