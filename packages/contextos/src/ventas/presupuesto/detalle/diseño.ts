import { LineaPresupuesto, Presupuesto } from "../diseño.ts";


export type EstadoPresupuesto = (
    'INICIAL' | "ABIERTO" | "APROBADO"
    | "BORRANDO_PRESUPUESTO"
    | "APROBANDO_PRESUPUESTO"
    | "CAMBIANDO_DIVISA"
    | "CAMBIANDO_CLIENTE"
    | "CREANDO_LINEA" | "BORRANDO_LINEA" | "CAMBIANDO_LINEA"
);

export type ContextoPresupuesto = {
    estado: EstadoPresupuesto,
    presupuesto: Presupuesto;
    presupuestoInicial: Presupuesto;
    lineaActiva: LineaPresupuesto | null;
};
