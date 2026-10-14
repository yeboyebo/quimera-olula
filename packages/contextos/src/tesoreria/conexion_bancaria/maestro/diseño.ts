import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { ConexionBancaria } from "../diseño.js";

/**
 * CONECTANDO activa el flujo de conexión (ver conectar_banco/ConectarBancoConexionBancaria.tsx),
 * que no muestra un modal propio: la UI la pone el widget del proveedor bancario activo.
 */
export type EstadoMaestroConexionBancaria = 'INICIAL' | 'CONECTANDO';

export type ContextoMaestroConexionBancaria = {
    estado: EstadoMaestroConexionBancaria;
    conexiones: ListaActivaEntidades<ConexionBancaria>;
};
