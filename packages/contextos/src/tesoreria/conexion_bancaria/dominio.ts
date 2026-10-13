import { ConexionBancaria, EstadoConexionBancaria } from "./diseño.ts";

export const conexionBancariaVacia: ConexionBancaria = {
    id: "",
    proveedor: "",
    institucionId: null,
    institucionNombre: null,
    estado: "activa",
    ultimaSincronizacion: null,
    ultimoError: null,
    creadoEn: new Date(0),
    cuentas: [],
};

export const ETIQUETA_ESTADO_CONEXION_BANCARIA: Record<EstadoConexionBancaria, string> = {
    activa: "Activa",
    requiere_reautenticacion: "Requiere reautenticación",
};

export const etiquetaEstadoConexionBancaria = (estado: EstadoConexionBancaria): string =>
    ETIQUETA_ESTADO_CONEXION_BANCARIA[estado];

export const requiereReautenticacion = (conexion: ConexionBancaria): boolean =>
    conexion.estado === "requiere_reautenticacion";

/**
 * Etiqueta legible de la institución — el proveedor no siempre devuelve el
 * nombre (p.ej. justo tras el alta, antes de que se resuelva del todo).
 */
export const nombreInstitucion = (conexion: ConexionBancaria): string =>
    conexion.institucionNombre ?? conexion.institucionId ?? "Banco sin identificar";
