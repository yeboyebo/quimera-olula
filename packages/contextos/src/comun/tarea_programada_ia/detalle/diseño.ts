import { IaTareaProgramada } from "../diseño.js";

export type EstadoDetalleIaTareaProgramada =
    | 'INICIAL'
    | 'ABIERTO'
    | 'BORRANDO';

export type ContextoDetalleIaTareaProgramada = {
    estado: EstadoDetalleIaTareaProgramada;
    tarea: IaTareaProgramada;
};
