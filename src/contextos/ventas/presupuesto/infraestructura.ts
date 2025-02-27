

import { crearAcciones } from "../../comun/infraestructura.ts";


export const accionesBasePresupuesto = crearAcciones("presupuesto");


export const accionesPresupuesto = {
  ...accionesBasePresupuesto,
};

