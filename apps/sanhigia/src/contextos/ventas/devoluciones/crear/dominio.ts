import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { MetaModelo } from "@olula/lib/dominio.ts";
import { getFacturaDevolucion } from "../infraestructura.ts";
import {
    ContextoCrearDevolucion,
    EstadoCrearDevolucion,
    FacturaSeleccionada,
    FormCrearDevolucion,
    contextoCrearDevolucionVacio,
} from "./diseño.ts";

export const formCrearDevolucionVacio: FormCrearDevolucion = {
    razonDevolucion: "",
};

export const metaFormCrearDevolucion: MetaModelo<FormCrearDevolucion> = {
    campos: {
        razonDevolucion: { requerido: true },
    },
};

export type ProcesarCrearDevolucion = ProcesarContexto<
    EstadoCrearDevolucion,
    ContextoCrearDevolucion
>;

export const seleccionarFacturaProceso: ProcesarCrearDevolucion = async (contexto, payload) => {
    return {
        ...contexto,
        facturaSeleccionada: (payload as FacturaSeleccionada | null) ?? null,
        error: "",
    };
};

export const buscarFacturaProceso: ProcesarCrearDevolucion = async (contexto, payload) => {
    const idFactura = String(
        payload ?? contexto.facturaSeleccionada?.valor ?? ""
    );

    if (!idFactura) {
        return {
            ...contexto,
            error: "Indica un identificador de factura",
        };
    }

    try {
        const factura = await getFacturaDevolucion(idFactura);
        return {
            ...contexto,
            estado: "EDITANDO_DEVOLUCION",
            factura,
            error: "",
        };
    } catch {
        return {
            ...contexto,
            estado: "SELECCIONANDO_FACTURA",
            factura: null,
            error: "No se ha podido cargar la factura",
        };
    }
};

export const volverABusquedaProceso: ProcesarCrearDevolucion = async (contexto) => ({
    ...contexto,
    estado: "SELECCIONANDO_FACTURA",
    factura: null,
    error: "",
});

export const limpiarFacturaProceso: ProcesarCrearDevolucion = async () => contextoCrearDevolucionVacio;
