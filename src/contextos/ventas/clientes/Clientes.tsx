import { Master } from "../../../componentes/Master.tsx";

const obtenerTodosLosClientes = async () => {
  return [
    { id: 1, nombre: "Juan" },
    { id: 2, nombre: "Ana" },
    { id: 3, nombre: "Pedro" },
    { id: 4, nombre: "María" },
  ];
};

const accionesCliente = {
  obtenerTodos: obtenerTodosLosClientes,
};

export const Clientes = () => {
  return <Master acciones={accionesCliente} />;
};
