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

const accionesCliente = {
  obtenerTodos: obtenerTodosLosClientes,
};

export const Clientes = () => {
  return <Master acciones={accionesCliente} />;
};
