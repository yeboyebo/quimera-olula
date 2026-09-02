import { Criteria, Entidad, Modelo, RespuestaLista } from "@olula/lib/diseño.ts";

export type TipoAuthCredencialExterna = "api_key" | "bearer" | "basic" | "oauth2";

/**
 * 'llm' es el modelo de IA del propio asistente (hoy Gemini, mañana más) —
 * solo puede haber una credencial LLM activa a la vez, lo impone el backend.
 * 'conector' es todo lo demás (Telegram, correo...), donde varias credenciales
 * activas del mismo proveedor sí son válidas.
 */
export type CategoriaCredencialExterna = "llm" | "conector";

/**
 * Interfaz principal de CredencialExterna: una credencial cifrada en el
 * backend para conectar con un servicio de terceros (otro servidor MCP,
 * un webhook, un plugin langchain...). El valor del secreto nunca se expone
 * por API una vez guardado — solo se puede escribir (alta) o rotar.
 */
export interface CredencialExterna extends Entidad {
    id: string;
    empresaId: string;
    nombre: string;
    proveedor: string;
    tipoAuth: TipoAuthCredencialExterna;
    activo: boolean;
    creadoPor: string;
    creadoEn: Date;
    actualizadoEn: Date;
    /**
     * Si tiene valor, la credencial es personal de ese usuario (su propia
     * cuenta de Gmail/Telegram...) — solo él la ve y puede usarla, ni
     * siquiera un admin de la empresa. Si es null, es de toda la empresa.
     * Fijo desde la creación (ver crear/CrearCredencialExterna.tsx).
     */
    propietarioId: string | null;
    categoria: CategoriaCredencialExterna;
}

/**
 * Secreto en claro tal como lo escribe el usuario — su forma depende de
 * `tipoAuth` (ver componentes/CamposSecreto.tsx). Solo viaja en las
 * llamadas de creación y rotación; nunca se guarda en el dominio persistente.
 */
export type SecretoCredencialExterna = Record<string, string>;

export interface NuevaCredencialExterna extends Modelo {
    empresaId: string;
    nombre: string;
    proveedor: string;
    tipoAuth: TipoAuthCredencialExterna;
    /**
     * Si es true, el backend la crea como personal del usuario autenticado
     * (ver CredencialExterna.propietarioId) — nunca se manda un id de usuario
     * concreto desde aquí, el backend siempre usa el del propio autor.
     */
    personal: boolean;
    categoria: CategoriaCredencialExterna;
}

export type CambiosCredencialExterna = Partial<Pick<CredencialExterna, "nombre" | "proveedor" | "activo">>;

export type GetCredencialExterna = (id: string) => Promise<CredencialExterna>;

export type GetCredencialesExterna = (criteria: Criteria) => RespuestaLista<CredencialExterna>;

export type PostCredencialExterna = (
    nuevaCredencial: NuevaCredencialExterna,
    secreto: SecretoCredencialExterna,
) => Promise<string>;

export type PatchCredencialExterna = (id: string, cambios: CambiosCredencialExterna) => Promise<void>;

export type RotarSecretoCredencialExterna = (id: string, secreto: SecretoCredencialExterna) => Promise<void>;

export type DeleteCredencialExterna = (id: string) => Promise<void>;
