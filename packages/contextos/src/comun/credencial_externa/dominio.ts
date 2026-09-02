import { MetaModelo, puede, stringNoVacio } from "@olula/lib/dominio.ts";
import {
    CategoriaCredencialExterna, CredencialExterna, SecretoCredencialExterna, TipoAuthCredencialExterna,
} from "./diseño.ts";

const CAMPOS_SECRETO_POR_TIPO: Record<TipoAuthCredencialExterna, string[]> = {
    api_key: ["api_key"],
    bearer: ["token"],
    basic: ["usuario", "password"],
    oauth2: ["client_id", "client_secret"],
};

export interface CampoSecreto {
    clave: string;
    etiqueta: string;
    contraseña?: boolean;
    /** Si es true, no lo exige `secretoCompleto` (p.ej. "modelo" de Gemini, que
     * tiene un valor por defecto razonable en el backend si se deja vacío). */
    opcional?: boolean;
}

export interface ProveedorConocido {
    valor: string;
    categoria: CategoriaCredencialExterna;
    tipoAuth: TipoAuthCredencialExterna;
    /** Nombre de icono de QIcono (packages/componentes/src/atomos/qicono.tsx). */
    icono: string;
    campos: CampoSecreto[];
}

/**
 * Catálogo de integraciones ya soportadas por el asistente de IA (modelo LLM
 * y flujos/tareas programadas — ver comun/tarea_programada_ia). Cada una fija
 * su propia forma de secreto — más específica que el genérico
 * `CAMPOS_SECRETO_POR_TIPO` — para que el formulario pida justo lo que hace
 * falta (p.ej. host/puerto de IMAP y SMTP, que no son "el secreto" en sí
 * pero viajan cifrados junto a él porque no hay otro sitio no-sensible donde
 * guardarlos). `proveedor` sigue siendo un string libre a nivel de dominio
 * (ver diseño.ts) para no cerrar la puerta a futuras integraciones que no
 * necesiten un formulario a medida — esas usan "Otro" (ver OTRO_PROVEEDOR),
 * solo disponible para conectores (categoria='conector'), nunca para el LLM:
 * un proveedor de IA sin dispatch en el backend no serviría de nada.
 */
export const PROVEEDORES_CONOCIDOS: ProveedorConocido[] = [
    {
        valor: "Gemini",
        categoria: "llm",
        tipoAuth: "api_key",
        icono: "google",
        campos: [
            { clave: "api_key", etiqueta: "API key", contraseña: true },
            { clave: "modelo", etiqueta: "Modelo (opcional — por defecto gemini-2.5-pro)", opcional: true },
        ],
    },
    {
        valor: "OpenAI",
        categoria: "llm",
        tipoAuth: "api_key",
        icono: "openai",
        campos: [
            { clave: "api_key", etiqueta: "API key", contraseña: true },
            { clave: "modelo", etiqueta: "Modelo (opcional — por defecto gpt-4.1)", opcional: true },
        ],
    },
    {
        valor: "Anthropic",
        categoria: "llm",
        tipoAuth: "api_key",
        icono: "anthropic",
        campos: [
            { clave: "api_key", etiqueta: "API key", contraseña: true },
            { clave: "modelo", etiqueta: "Modelo (opcional — por defecto claude-sonnet-5)", opcional: true },
        ],
    },
    {
        valor: "Mistral",
        categoria: "llm",
        tipoAuth: "api_key",
        icono: "mistral",
        campos: [
            { clave: "api_key", etiqueta: "API key", contraseña: true },
            { clave: "modelo", etiqueta: "Modelo (opcional — por defecto mistral-large-latest)", opcional: true },
        ],
    },
    {
        valor: "Azure OpenAI",
        categoria: "llm",
        tipoAuth: "api_key",
        icono: "azure",
        campos: [
            { clave: "api_key", etiqueta: "API key", contraseña: true },
            { clave: "endpoint", etiqueta: "Endpoint (p.ej. https://mi-recurso.openai.azure.com)" },
            { clave: "despliegue", etiqueta: "Nombre del despliegue" },
            { clave: "version_api", etiqueta: "Versión de la API (opcional)", opcional: true },
        ],
    },
    {
        // Sin api_key: Ollama sirve modelos autoalojados en la propia infraestructura
        // del cliente. `tipoAuth: "api_key"` no describe bien este caso (no hay
        // ninguna clave), pero es un campo obligatorio a nivel de dominio y ninguno
        // de los 4 valores encaja mejor — no afecta a qué campos pide el formulario,
        // que vienen siempre de `campos`, no de `tipoAuth`, para un proveedor conocido.
        valor: "Ollama",
        categoria: "llm",
        tipoAuth: "api_key",
        icono: "ollama",
        campos: [
            { clave: "base_url", etiqueta: "URL del servidor (p.ej. http://localhost:11434)" },
            { clave: "modelo", etiqueta: "Modelo (debe soportar tool-calling, p.ej. llama3.1, qwen2.5)" },
        ],
    },
    {
        valor: "Telegram",
        categoria: "conector",
        tipoAuth: "api_key",
        icono: "telegram",
        campos: [
            { clave: "bot_token", etiqueta: "Token del bot", contraseña: true },
            {
                clave: "chat_id_autorizado",
                etiqueta: "Tu ID numérico de Telegram (p.ej. vía @userinfobot)",
            },
        ],
        // `chat_id_autorizado` es obligatorio (no `opcional: true`) a propósito: sin él,
        // el webhook de mensajes entrantes (consultas/comun/ia/aplicacion_telegram.py)
        // no tiene forma de saber quién puede escribirle al bot con tus permisos — un
        // bot puede recibir mensajes de cualquiera que le escriba, o de cualquier
        // miembro de un grupo en el que esté metido.
    },
    {
        valor: "Gmail",
        categoria: "conector",
        tipoAuth: "oauth2",
        icono: "gmail",
        campos: [
            { clave: "client_id", etiqueta: "Client ID" },
            { clave: "client_secret", etiqueta: "Client secret", contraseña: true },
            { clave: "refresh_token", etiqueta: "Refresh token", contraseña: true },
        ],
    },
    {
        valor: "Correo (IMAP/SMTP)",
        categoria: "conector",
        tipoAuth: "basic",
        icono: "correo",
        campos: [
            { clave: "usuario", etiqueta: "Usuario" },
            { clave: "password", etiqueta: "Contraseña", contraseña: true },
            { clave: "imap_host", etiqueta: "Servidor IMAP (entrada)" },
            { clave: "imap_puerto", etiqueta: "Puerto IMAP" },
            { clave: "smtp_host", etiqueta: "Servidor SMTP (salida)" },
            { clave: "smtp_puerto", etiqueta: "Puerto SMTP" },
        ],
    },
];

export const OTRO_PROVEEDOR = "Otro";
export const ICONO_OTRO_PROVEEDOR = "ajustes";

export const buscarProveedorConocido = (proveedor: string): ProveedorConocido | undefined =>
    PROVEEDORES_CONOCIDOS.find((p) => p.valor === proveedor);

export const proveedoresPorCategoria = (categoria: CategoriaCredencialExterna): ProveedorConocido[] =>
    PROVEEDORES_CONOCIDOS.filter((p) => p.categoria === categoria);

export const opcionesProveedorPorCategoria = (
    categoria: CategoriaCredencialExterna
): { valor: string; descripcion: string }[] => [
    ...proveedoresPorCategoria(categoria).map((p) => ({ valor: p.valor, descripcion: p.valor })),
    ...(categoria === "conector" ? [{ valor: OTRO_PROVEEDOR, descripcion: "Otro (especificar)" }] : []),
];

export const iconoProveedor = (proveedor: string): string =>
    buscarProveedorConocido(proveedor)?.icono ?? ICONO_OTRO_PROVEEDOR;

/**
 * Comprueba que el secreto trae todos los campos que exige el proveedor (si
 * es uno conocido, ver PROVEEDORES_CONOCIDOS) o si no `tipoAuth` — usado para
 * habilitar los botones de crear/rotar (ver CamposSecreto.tsx).
 */
export const secretoCompleto = (
    proveedor: string,
    tipoAuth: TipoAuthCredencialExterna,
    secreto: SecretoCredencialExterna,
): boolean => {
    const campos = buscarProveedorConocido(proveedor)?.campos
        .filter((campo) => !campo.opcional)
        .map((campo) => campo.clave)
        ?? CAMPOS_SECRETO_POR_TIPO[tipoAuth];

    return campos.every((campo) => stringNoVacio(secreto[campo] ?? ""));
};

export const credencialExternaVacia: CredencialExterna = {
    id: "",
    empresaId: "",
    nombre: "",
    proveedor: "",
    tipoAuth: "api_key",
    activo: true,
    creadoPor: "",
    creadoEn: new Date(0),
    actualizadoEn: new Date(0),
    propietarioId: null,
    categoria: "conector",
};

export const OPCIONES_TIPO_AUTH: { valor: TipoAuthCredencialExterna; descripcion: string }[] = [
    { valor: "api_key", descripcion: "API key" },
    { valor: "bearer", descripcion: "Token Bearer" },
    { valor: "basic", descripcion: "Usuario y contraseña" },
    { valor: "oauth2", descripcion: "OAuth2 (Client ID / Secret)" },
];

/**
 * Metadatos del formulario de detalle. `tipoAuth` no es editable tras la
 * creación (el backend no lo permite — cambiar de forma de autenticación
 * invalidaría la forma del secreto ya guardado), ni tampoco `activo`
 * (se alterna con la acción "Activar/Desactivar") ni el secreto (se rota
 * con su propio modal, ver rotar/RotarCredencialExterna.tsx).
 */
export const metaCredencialExterna: MetaModelo<CredencialExterna> = {
    campos: {
        nombre: {
            requerido: true,
            validacion: (m: CredencialExterna) => stringNoVacio(m.nombre),
        },
        proveedor: {
            requerido: true,
            validacion: (m: CredencialExterna) => stringNoVacio(m.proveedor),
        },
    },
    editable: () => puede("comun.credencial_externa"),
};
