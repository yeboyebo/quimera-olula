import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { MetaModelo } from "@olula/lib/dominio.ts";
import { getFacturaDevolucion } from "../infraestructura.ts";
import {
    ContextoCrearDevolucion,
    EstadoCrearDevolucion,
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

export const buscarFacturaProceso: ProcesarCrearDevolucion = async (_contexto, payload) => {
    const idFactura = String(payload ?? "");

    if (!idFactura) {
        return {
            ...contextoCrearDevolucionVacio,
            error: "Indica un identificador de factura",
        };
    }

    try {
        const factura = await getFacturaDevolucion(idFactura);
        return {
            estado: "INICIAL",
            factura,
            error: "",
        };
    } catch {
        return {
            ...contextoCrearDevolucionVacio,
            error: "No se ha podido cargar la factura",
        };
    }
};

export const limpiarFacturaProceso: ProcesarCrearDevolucion = async () => contextoCrearDevolucionVacio;
