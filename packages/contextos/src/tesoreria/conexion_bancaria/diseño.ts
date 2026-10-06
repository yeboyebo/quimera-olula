import { Criteria, Entidad, RespuestaLista } from "@olula/lib/diseño.ts";

/**
 * Nombre del proveedor bancario que gestiona esta conexión (p.ej. "plaid").
 * Solo hay un proveedor activo por instalación (ver `comun/banca.ts`), pero
 * se guarda por conexión tal cual lo devuelve el backend.
 */
export type ProveedorConexionBancaria = string;

/**
 * `activa`: la conexión funciona y puede sincronizarse.
 * `requiere_reautenticacion`: el consentimiento PSD2 caducó o el proveedor
 * devolvió un error de credenciales — hay que reautenticar con su widget.
 */
export type EstadoConexionBancaria = "activa" | "requiere_reautenticacion";

/**
 * Una cuenta que el proveedor expone dentro de una conexión. `cuentaBancoId`
 * es null hasta que se asocia a mano o el backend la casa automáticamente
 * por IBAN al crear la conexión.
 */
export interface CuentaConexionBancaria extends Entidad {
    id: string;
    idExterno: string;
    nombre: string;
    mascara: string | null;
    tipo: string | null;
    subtipo: string | null;
    iban: string | null;
    cuentaBancoId: string | null;
    descripcionCuentaBanco: string | null;
    activa: boolean;
}

export interface ConexionBancaria extends Entidad {
    id: string;
    proveedor: ProveedorConexionBancaria;
    institucionId: string | null;
    institucionNombre: string | null;
    estado: EstadoConexionBancaria;
    ultimaSincronizacion: Date | null;
    ultimoError: string | null;
    creadoEn: Date;
    cuentas: CuentaConexionBancaria[];
}

/**
 * Cambios que admite la asociación de una cuenta del banco con una cuenta
 * bancaria de la empresa (`cuentaBancoId: null` la desasocia).
 */
export type CambiosCuentaConexionBancaria = {
    cuentaBancoId: string | null;
    activa: boolean;
};

export type GetConexionBancaria = (id: string) => Promise<ConexionBancaria>;

export type GetConexionesBancarias = (criteria: Criteria) => RespuestaLista<ConexionBancaria>;

/**
 * Lo que devuelve el backend para iniciar una conexión con el proveedor
 * activo: qué proveedor es y los datos que necesita su UI (ver
 * comun/proveedor_bancario/) para completarla — para Plaid, un `link_token`.
 */
export type DatosInicioConexionBancaria = {
    proveedor: string;
    datos: Record<string, unknown>;
};

/**
 * `POST tesoreria/conexion_bancaria/iniciar`. Sin `conexionId`: alta de un
 * banco nuevo. Con `conexionId`: reautenticación de una conexión existente.
 */
export type PostIniciarConexionBancaria = (conexionId?: string) => Promise<DatosInicioConexionBancaria>;

/**
 * Tras completar la reautenticación con el widget del proveedor: el backend
 * comprueba el acceso con `datos` y reactiva la conexión.
 */
export type PatchReautenticarConexionBancaria = (id: string, datos: Record<string, unknown>) => Promise<void>;

/**
 * Envía lo que devolvió el widget del proveedor al completar la conexión
 * (Plaid: `{ public_token }`). El backend hace el intercambio con el
 * proveedor, trae cuentas e IBAN y asocia automáticamente las cuentas cuyo
 * IBAN coincide con una cuenta bancaria de la empresa.
 */
export type PostConexionBancaria = (datos: Record<string, unknown>) => Promise<string>;

export type PatchCuentaConexionBancaria = (
    conexionId: string,
    cuentaId: string,
    cambios: CambiosCuentaConexionBancaria,
) => Promise<void>;

/**
 * Revoca el acceso en el proveedor y borra la conexión.
 */
export type DeleteConexionBancaria = (id: string) => Promise<void>;
