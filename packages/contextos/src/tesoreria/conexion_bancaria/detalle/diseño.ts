import { ConexionBancaria } from "../diseño.js";

export type EstadoDetalleConexionBancaria =
    | 'INICIAL'
    | 'ABIERTO'
    | 'REAUTENTICANDO'
    | 'DESCONECTANDO';

export type ContextoDetalleConexionBancaria = {
    estado: EstadoDetalleConexionBancaria;
    conexion: ConexionBancaria;
};
