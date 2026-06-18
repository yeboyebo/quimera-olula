import { FacturaDevolucion } from "../diseño.ts";

export type FacturaSeleccionada = {
    valor: string;
    descripcion: string;
};

export type EstadoCrearDevolucion = "SELECCIONANDO_FACTURA" | "EDITANDO_DEVOLUCION";

export type ContextoCrearDevolucion = {
    estado: EstadoCrearDevolucion;
    facturaSeleccionada: FacturaSeleccionada | null;
    factura: FacturaDevolucion | null;
    error: string;
};

export const contextoCrearDevolucionVacio: ContextoCrearDevolucion = {
    estado: "SELECCIONANDO_FACTURA",
    facturaSeleccionada: null,
    factura: null,
    error: "",
};

export type FormCrearDevolucion = {
    razonDevolucion: string;
};
