type LegacyMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type LegacyOrder = {
    field: string;
    direction: "ASC" | "DESC";
};

export type LegacyParams = {
    filter?: unknown;
    page?: unknown;
    order?: LegacyOrder | string | null;
    fields?: string[] | string;
    extra?: Record<string, string | number | boolean | null | undefined>;
};

type LegacyRequestError = {
    nombre: string;
    descripcion: string;
};

const BASE = import.meta.env.VITE_LEGACY_API_URL || "http://127.0.0.1:8005/api/";

const tokenLegacy = () => {
    const tk = localStorage.getItem("token-refresco");
    return tk ? `Token ${tk}` : "";
};

export const legacyQuery = ({ filter, page, order, fields, extra }: LegacyParams = {}) => {
    const params = new URLSearchParams();

    if (filter !== undefined) {
        params.append("filter", JSON.stringify(filter));
    }
    if (page !== undefined) {
        params.append("page", JSON.stringify(page));
    }
    if (fields) {
        params.append("fields", Array.isArray(fields) ? fields.join(",") : fields);
    }
    if (order) {
        if (typeof order === "string") {
            params.append("order", order);
        } else {
            params.append("order", `${order.field} ${order.direction}`);
        }
    }
    if (extra) {
        Object.entries(extra).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                params.append(key, String(value));
            }
        });
    }

    const query = params.toString();
    return query ? `?${query}` : "";
};

const escaped = (value: string) =>
    encodeURIComponent(value.replaceAll("/", "{Slash}").replaceAll(".", "YBPointYB"));

export const legacyUrl = (
    model: string,
    {
        id,
        action,
        staticAction,
        params,
    }: {
        id?: string;
        action?: string;
        staticAction?: boolean;
        params?: LegacyParams;
    } = {}
) => {
    const idPath = id ? `/${escaped(id)}` : "";
    const actionPath = action ? `${staticAction ? "/-static-" : ""}/${action}` : "";
    return `${model}${idPath}${actionPath}${legacyQuery(params)}`;
};

const llamada = async <T>({
    method,
    url,
    headers = {},
    body,
    msgError,
}: {
    method: LegacyMethod;
    url: string;
    headers?: Record<string, string>;
    body?: T;
    msgError?: string;
}): Promise<Response> => {
    const token = tokenLegacy();
    const response = await fetch(`${BASE}${url}`, {
        method,
        headers: {
            ...(method === "GET" || method === "DELETE" ? {} : { "Content-Type": "application/json" }),
            ...(token ? { Authorization: token } : {}),
            ...headers,
        },
        body: method === "GET" || method === "DELETE" ? undefined : JSON.stringify(body ?? {}),
    });

    if (!response.ok) {
        const errorText = await response.text();
        const error: LegacyRequestError = {
            nombre: msgError || `Error ${response.status}`,
            descripcion: errorText,
        };
        return Promise.reject(error);
    }

    return response;
};

const consulta = async <T>(url: string, msgError?: string): Promise<T> =>
    llamada({ method: "GET", url, msgError }).then((r) => r.json() as Promise<T>);

const comando = async <T, U>(
    method: LegacyMethod,
    url: string,
    msgError?: string,
    body?: Partial<T>
): Promise<U> =>
    llamada({ method, url, msgError, body }).then((r) => {
        const contentType = r.headers.get("content-type") || "";
        const textoPlano = contentType.startsWith("text/plain");

        return (textoPlano ? r.text().then((t) => ({ respuesta: t })) : r.json()) as Promise<U>;
    });

export const LegacyAPI = {
    get: <T>(url: string, msgError?: string) => consulta<T>(url, msgError),
    post: <T, U>(url: string, body: T, msgError?: string) => comando<T, U>("POST", url, msgError, body),
    put: <T, U = void>(url: string, body: T, msgError?: string) => comando<T, U>("PUT", url, msgError, body),
    patch: <T, U = void>(url: string, body: Partial<T>, msgError?: string) => comando<T, U>("PATCH", url, msgError, body),
    delete: <U = void>(url: string, msgError?: string) => comando<unknown, U>("DELETE", url, msgError),
    blob: (url: string, msgError?: string) => llamada({ method: "GET", url, msgError }).then((r) => r.blob()),
};
