import { RestAPI } from "../../comun/api/rest_api.ts";
import { crearAcciones } from "../../comun/infraestructura.ts";
import { Direccion, DireccionCliente } from "./diseño.ts";


export const accionesBaseCliente = crearAcciones("cliente");



export const obtenerDireccionesCliente = async (clienteId: string) =>
  RestAPI.get<{ datos: DireccionCliente[] }>(
    `/ventas/cliente/${clienteId}/direcciones`
  ).then((respuesta) => {
    return respuesta.datos;
  });

export const obtenerDireccionCliente =
  (clienteId: string) => async (dirClienteId: string) =>
    RestAPI.get<{ datos: DireccionCliente }>(
      `/ventas/cliente/${clienteId}/direcciones/${dirClienteId}`
    ).then((respuesta) => {
      return respuesta.datos;
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

export const obtenerOpcionesSelector =
  (path: string) => async () =>
    RestAPI.get<{ datos: [] }>(
      `/cache/comun/${path}`
    ).then((respuesta) => {
      return respuesta.datos;
    });

export const accionesCliente = {
  ...accionesBaseCliente,
  eliminarUno: eliminarCliente,
  obtenerOpcionesSelector,
};

export const accionesDirCliente = {
  obtenerTodos: obtenerDireccionesCliente,
  obtenerUno: obtenerDireccionCliente,
  crearUno: crearDireccionCliente,
  actualizarUno: cambiarDireccionCliente,
  eliminarUno: borrarDireccionCliente,
  marcarFacturacion: marcarDireccionFacturacion,
};
