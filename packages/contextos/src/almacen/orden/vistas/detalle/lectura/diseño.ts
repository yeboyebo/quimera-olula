import { NuevaLecturaOrden } from "#/almacen/orden/diseño.ts";
import { MetaModelo } from "@olula/lib/dominio.ts";

export type { NuevaLecturaOrden };

export const metaNuevaLecturaOrden: MetaModelo<NuevaLecturaOrden> = {
    campos: {
        sku: {
            validacion: (lectura) => {
                if (!lectura.sku) return "El SKU es requerido";
                return true;
            },
        },
        cantidad: {
            tipo: "numero",
            validacion: (lectura) => {
                if (!lectura.cantidad) return "La cantidad es requerida";
                return true;
            },
        },
        idUbicacionDestino: {
            requerido: false,
        },
        idUbicacionOrigen: {
            requerido: false,
        },
    },
    onChange: (lectura, campo, _, otros) => {
        if (campo === "idCajaDestino" && otros) {
            const nuevoValor: NuevaLecturaOrden = {
                ...lectura,
                idUbicacionDestino: otros.idUbicacion as string
            }
            return nuevoValor
        }
        return lectura
    }
};
