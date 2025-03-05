
import { crearAcciones } from "../../comun/infraestructura.ts";


export const accionesBaseCliente = crearAcciones("cliente");


export const accionesCliente = {
  ...accionesBaseCliente,
};

