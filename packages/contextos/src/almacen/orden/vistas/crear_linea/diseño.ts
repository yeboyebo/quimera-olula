import { MetaModelo } from "@olula/lib/dominio.ts";

export type NuevaLineaOrden = {
    sku: string;
    cantidadPrevista: number;
};

export const metaNuevaLineaOrden: MetaModelo<NuevaLineaOrden> = {
    campos: {
        sku: {
            validacion: (linea) => {
                if (!linea.sku) return "El SKU es requerido";
                return true;
            },
        },
        cantidadPrevista: {
            tipo: "numero",
            validacion: (linea) => {
                if (linea.cantidadPrevista === null || linea.cantidadPrevista === undefined) {
                    return "La cantidad prevista es requerida";
                }
                return true;
            },
        },
    },
};
