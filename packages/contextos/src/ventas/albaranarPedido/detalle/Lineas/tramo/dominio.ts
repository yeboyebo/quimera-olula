import { Tramo } from "../../../diseño.ts";

export const construirTramoGuardado = ({
    tramo,
    lote_id,
    ubicacion_id,
    cantidad,
    usaLotes,
    usaUbicaciones,
}: {
    tramo: Tramo;
    lote_id: string;
    ubicacion_id: string;
    cantidad: number;
    usaLotes: boolean;
    usaUbicaciones: boolean;
}): Tramo => {
    return {
        ...tramo,
        lote_id: usaLotes ? lote_id : tramo.lote_id,
        ubicacion_id: usaUbicaciones ? ubicacion_id : tramo.ubicacion_id,
        cantidad,
    };
};
