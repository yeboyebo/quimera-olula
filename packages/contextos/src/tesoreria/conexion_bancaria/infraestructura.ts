import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { fechaDesdeApi } from "../comun/infraestructura.js";
import ApiUrls from "../comun/urls.js";
import {
    ConexionBancaria,
    CuentaConexionBancaria,
    DeleteConexionBancaria,
    EstadoConexionBancaria,
    GetConexionBancaria,
    GetConexionesBancarias,
    PatchCuentaConexionBancaria,
    PatchReautenticarConexionBancaria,
    PostConexionBancaria,
    PostIniciarConexionBancaria,
    ProveedorConexionBancaria,
} from "./diseño.js";

export interface CuentaConexionBancariaApi {
    id: string;
    id_externo: string;
    nombre: string;
    mascara: string | null;
    tipo: string | null;
    subtipo: string | null;
    iban: string | null;
    cuenta_banco_id: string | null;
    descripcion_cuenta_banco: string | null;
    activa: boolean;
}

interface CambiosCuentaConexionBancariaApi {
    cuenta_banco_id: string | null;
    activa: boolean;
}

export interface ConexionBancariaApi {
    id: string;
    proveedor: ProveedorConexionBancaria;
    institucion_id: string | null;
    institucion_nombre: string | null;
    estado: EstadoConexionBancaria;
    ultima_sincronizacion: string | null;
    ultimo_error: string | null;
    creado_en: string;
    cuentas: CuentaConexionBancariaApi[];
}

interface IniciarConexionBancariaApi {
    proveedor: string;
    datos: Record<string, unknown>;
}

const baseUrl = new ApiUrls().CONEXION_BANCARIA;

const cuentaConexionBancariaDesdeApi = (api: CuentaConexionBancariaApi): CuentaConexionBancaria => ({
    id: api.id,
    idExterno: api.id_externo,
    nombre: api.nombre,
    mascara: api.mascara,
    tipo: api.tipo,
    subtipo: api.subtipo,
    iban: api.iban,
    cuentaBancoId: api.cuenta_banco_id,
    descripcionCuentaBanco: api.descripcion_cuenta_banco,
    activa: api.activa,
});

export const conexionBancariaDesdeApi = (api: ConexionBancariaApi): ConexionBancaria => ({
    id: api.id,
    proveedor: api.proveedor,
    institucionId: api.institucion_id,
    institucionNombre: api.institucion_nombre,
    estado: api.estado,
    ultimaSincronizacion: fechaDesdeApi(api.ultima_sincronizacion),
    ultimoError: api.ultimo_error,
    creadoEn: new Date(api.creado_en),
    cuentas: (api.cuentas ?? []).map(cuentaConexionBancariaDesdeApi),
});

export const getConexionBancaria: GetConexionBancaria = async (id) => {
    return await RestAPI.getItem<ConexionBancaria, ConexionBancariaApi>(
        `${baseUrl}/${id}`,
        conexionBancariaDesdeApi,
        "Error al obtener la conexión bancaria"
    );
};

export const getConexionesBancarias: GetConexionesBancarias = async (criteria) => {
    return await RestAPI.getQuery<ConexionBancaria, ConexionBancariaApi>(
        baseUrl,
        criteria,
        conexionBancariaDesdeApi,
        "Error al obtener las conexiones bancarias"
    );
};

/**
 * Pide al backend los datos para iniciar la conexión con el proveedor activo
 * (para Plaid, un `link_token` de un solo uso). Con `conexionId`, pide los
 * datos para reautenticar esa conexión en concreto en vez de crear una nueva.
 */
export const postIniciarConexionBancaria: PostIniciarConexionBancaria = async (conexionId) => {
    const respuesta = await RestAPI.query<{ id?: string }, IniciarConexionBancariaApi>(
        `${baseUrl}/iniciar`,
        conexionId ? { id: conexionId } : {},
        "Error al iniciar la conexión con el banco"
    );
    return { proveedor: respuesta.proveedor, datos: respuesta.datos };
};

export const patchReautenticarConexionBancaria: PatchReautenticarConexionBancaria = async (id, datos) => {
    await RestAPI.patch(
        `${baseUrl}/${id}/reautenticar`,
        { datos },
        "Error al reautenticar la conexión bancaria"
    );
};

export const postConexionBancaria: PostConexionBancaria = async (datos) => {
    const respuesta = await RestAPI.post(
        baseUrl,
        { datos },
        "Error al conectar el banco"
    );
    return respuesta.id;
};

export const patchCuentaConexionBancaria: PatchCuentaConexionBancaria = async (conexionId, cuentaId, cambios) => {
    await RestAPI.patch<CambiosCuentaConexionBancariaApi>(
        `${baseUrl}/${conexionId}/cuenta/${cuentaId}`,
        { cuenta_banco_id: cambios.cuentaBancoId, activa: cambios.activa },
        "Error al asociar la cuenta bancaria"
    );
};

export const deleteConexionBancaria: DeleteConexionBancaria = async (id) => {
    await RestAPI.delete(
        `${baseUrl}/${id}`,
        "Error al desconectar el banco"
    );
};
