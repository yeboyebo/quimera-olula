import { FacturaDevolucion } from "../diseño.ts";

export type EstadoCrearDevolucion = "INICIAL";

export type ContextoCrearDevolucion = {
    estado: EstadoCrearDevolucion;
    factura: FacturaDevolucion | null;
    error: string;
};

export const contextoCrearDevolucionVacio: ContextoCrearDevolucion = {
    estado: "INICIAL",
    factura: null,
    error: "",
};

export type FormCrearDevolucion = {
    razonDevolucion: string;
};
