

import { CampoFormularioGenerico } from "../../../componentes/detalle/FormularioGenerico.tsx";
import { crearAcciones } from "../../comun/infraestructura.ts";


export const accionesBasePresupuesto = crearAcciones("presupuesto");


export const accionesPresupuesto = {
  ...accionesBasePresupuesto,
};

export const camposLineasPresupuestoAlta: CampoFormularioGenerico[] = [
  { nombre: "articulo_id", etiqueta: "Referencia", tipo: "text" },
  { nombre: "cantidad", etiqueta: "Cantidad", tipo: "number" },
];

export const camposPresupuesto: CampoFormularioGenerico[] = [
  { nombre: "id", etiqueta: "Código", tipo: "text", oculto: true },
  { nombre: "codigo", etiqueta: "Código", tipo: "text" },
  { nombre: "fecha", etiqueta: "Fecha", tipo: "date" },
  { nombre: "cliente_id", etiqueta: "ID Cliente", tipo: "text" },
  { nombre: "nombre_cliente", etiqueta: "Nombre Cliente", tipo: "text" },
  { nombre: "id_fiscal", etiqueta: "ID Fiscal", tipo: "text" },
  { nombre: "direccion_id", etiqueta: "ID Dirección", tipo: "text" },
];

export const camposLineasPresupuesto: CampoFormularioGenerico[] = [
  { nombre: "id", etiqueta: "ID", tipo: "text", oculto: true },
  { nombre: "referencia", etiqueta: "Referencia", tipo: "text" },
  { nombre: "descripcion", etiqueta: "Descripción", tipo: "text" },
  { nombre: "cantidad", etiqueta: "Cantidad", tipo: "number" },
  { nombre: "pvp_unitario", etiqueta: "PVP Unitario", tipo: "number" },
  { nombre: "pvp_total", etiqueta: "PVP Total", tipo: "number" },
];

export const camposPresupuestoNuevo: CampoFormularioGenerico[] = [
  { nombre: "cliente_id", etiqueta: "ID Cliente", tipo: "text" },
  { nombre: "direccion_id", etiqueta: "ID Dirección", tipo: "text" },
  { nombre: "empresa_id", etiqueta: "ID Empresa", tipo: "text" },
];