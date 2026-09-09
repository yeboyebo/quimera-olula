import { CredencialExterna } from "../diseño.js";

export type EstadoDetalleCredencialExterna =
    | 'INICIAL'
    | 'ABIERTO'
    | 'BORRANDO'
    | 'ROTANDO';

export type ContextoDetalleCredencialExterna = {
    estado: EstadoDetalleCredencialExterna;
    credencial: CredencialExterna;
};
