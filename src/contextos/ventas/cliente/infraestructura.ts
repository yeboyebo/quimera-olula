
import { RestAPI } from "../../comun/api/rest_api.ts";
import { crearAcciones } from "../../comun/infraestructura.ts";


export const accionesBaseCliente = crearAcciones("cliente");

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
  eliminarCliente,
  obtenerOpcionesSelector,
};

