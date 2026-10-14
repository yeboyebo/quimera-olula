import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { ejecutarListaProcesos, MetaModelo } from "@olula/lib/dominio.ts";
import { ConexionBancaria } from "../diseño.js";
import { conexionBancariaVacia } from "../dominio.js";
import { getConexionBancaria } from "../infraestructura.js";
import { ContextoDetalleConexionBancaria, EstadoDetalleConexionBancaria } from "./diseño.js";

type ProcesarDetalle = ProcesarContexto<EstadoDetalleConexionBancaria, ContextoDetalleConexionBancaria>;

const pipeConexionBancaria = ejecutarListaProcesos<EstadoDetalleConexionBancaria, ContextoDetalleConexionBancaria>;

/**
 * Solo lectura: la conexión la gestiona el proveedor bancario (institución,
 * estado, cursor de sincronización...), aquí no hay nada que editar a mano
 * salvo la asociación de cuentas (ver detalle/cuentas/CuentasConexionBancaria.tsx).
 */
export const metaConexionBancaria: MetaModelo<ConexionBancaria> = {
    campos: {
        proveedor: { tipo: "texto" },
        institucionId: { tipo: "texto" },
        institucionNombre: { tipo: "texto" },
        estado: { tipo: "texto" },
        ultimaSincronizacion: { tipo: "fecha" },
        ultimoError: { tipo: "texto" },
        creadoEn: { tipo: "fecha" },
    },
    editable: () => false,
};

export const contextoDetalleConexionBancariaInicial: ContextoDetalleConexionBancaria = {
    estado: 'INICIAL',
    conexion: conexionBancariaVacia,
};

export const cargarConexionBancaria: (_: string) => ProcesarDetalle =
    (idConexion) => async (contexto) => {
        const conexion = await getConexionBancaria(idConexion);
        return pipeConexionBancaria(contexto, [
            async (ctx) => ({ ...ctx, conexion }),
            'ABIERTO',
        ]);
    };

export const cargarContexto: ProcesarDetalle = async (contexto, payload) => {
    const idConexion = payload as string;
    if (idConexion) {
        return cargarConexionBancaria(idConexion)(contexto);
    }
    return { ...contexto, estado: 'INICIAL', conexion: conexionBancariaVacia };
};

/**
 * Refresca la conexión completa (cabecera + cuentas) tras asociar/activar una
 * cuenta (ver detalle/cuentas/CuentasConexionBancaria.tsx). Propaga el cambio
 * al maestro para mantener la lista sincronizada.
 */
export const refrescarConexionBancaria: ProcesarDetalle = async (contexto) => {
    const conexion = await getConexionBancaria(contexto.conexion.id);
    return [
        { ...contexto, estado: 'ABIERTO', conexion },
        [["conexion_bancaria_cambiada", conexion]],
    ];
};
