import { Master } from "../../../componentes/Master.tsx";
import { RestAPI } from "../../comun/api/rest_api.ts";
import { clientesFake } from "./clientesFake.ts";

export type Cliente = {
  id: string;
  nombre: string;
  id_fiscal: string;
};

const obtenerTodosLosClientes = async () =>
  RestAPI.get<{ clientes: Cliente[] }>("/quimera/ventas/cliente")
    .then((respuesta) => respuesta.clientes)
    .catch(() => clientesFake);

const obtenerUnCliente = async (id: string) =>
  RestAPI.get<Cliente>(`/quimera/ventas/cliente/${id}`).catch(
    () => clientesFake.find((cliente) => cliente.id === id) ?? null
  );

const crearCliente = async (cliente: Cliente) =>
  RestAPI.post(`/quimera/ventas/cliente/${cliente.id}`, cliente).catch(
    () => {}
  );

const actualizarCliente = async (cliente: Cliente) =>
  RestAPI.patch(`/quimera/ventas/cliente/${cliente.id}`, cliente).catch(
    () => {}
  );

const eliminarCliente = async (id: string) =>
  RestAPI.delete(`/quimera/ventas/cliente/${id}`).catch(() => {});

const accionesCliente = {
  obtenerTodos: obtenerTodosLosClientes,
  obtenerUno: obtenerUnCliente,
  crearUno: crearCliente,
  actualizarUno: actualizarCliente,
  eliminarUno: eliminarCliente,
};

export const Clientes = () => {
  return <Master acciones={accionesCliente} />;
};
