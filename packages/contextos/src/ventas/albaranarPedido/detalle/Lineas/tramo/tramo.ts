import { MetaModelo } from "@olula/lib/dominio.js";
import { Tramo } from "../../../diseño.ts";

export interface TramoEditable extends Tramo {
    lote_id: string;
    ubicacion_id: string;
    maximoPermitido: number;
}

export const tramoEditableInicial = (
    tramo: Tramo,
    maximoPermitido: number
): TramoEditable => ({
    ...tramo,
    lote_id: tramo.lote_id ?? "",
    ubicacion_id: tramo.ubicacion_id ?? "",
    cantidad: tramo.cantidad ?? 0,
    maximoPermitido,
});

const cantidadValida = (tramo: TramoEditable): boolean | string => {
    if (tramo.cantidad > tramo.maximoPermitido) {
        return `La cantidad no puede ser mayor que ${tramo.maximoPermitido}`;
    }
    if (tramo.cantidad <= 0) {
        return false;
    }
    return true;
};

export const crearMetaTramoEditable = (
    usaLotes: boolean,
    usaUbicaciones: boolean
): MetaModelo<TramoEditable> => ({
    campos: {
        lote_id: { tipo: "texto", requerido: usaLotes },
        ubicacion_id: { tipo: "texto", requerido: usaUbicaciones },
        cantidad: { tipo: "numero", requerido: true, validacion: cantidadValida },
    },
});
