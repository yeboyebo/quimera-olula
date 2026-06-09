type LegacyMethod = "GET" | "POST" | "PATCH" | "DELETE";

type LegacyOrder = {
    field: string;
    direction: "ASC" | "DESC";
};

type LegacyParams = {
    filter?: unknown;
    page?: unknown;
    order?: LegacyOrder | string | null;
    fields?: string[] | string;
    extra?: Record<string, string | number | boolean | null | undefined>;
};

const baseUrlLegacy = () =>
    import.meta.env.VITE_LEGACY_API_URL || "http://127.0.0.1:8005/api/";

const tokenLegacy = () => {
    const tk = localStorage.getItem("token-refresco");
    return tk ? `Token ${tk}` : "";
};

const makeQuery = ({ filter, page, order, fields, extra }: LegacyParams) => {
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

const legacyCall = async <T>(
    method: LegacyMethod,
    path: string,
    {
        body,
        params,
    }: {
        body?: unknown;
        params?: LegacyParams;
    } = {}
): Promise<T> => {
    const url = `${baseUrlLegacy()}${path}${params ? makeQuery(params) : ""}`;
    const token = tokenLegacy();

    const response = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: token } : {}),
        },
        body: method === "GET" || method === "DELETE" ? undefined : JSON.stringify(body ?? {}),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error HTTP ${response.status}`);
    }

    return response.json() as Promise<T>;
};

export const legacyGet = <T>(
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
): Promise<T> => {
    const idPath = id ? `/${escaped(id)}` : "";
    const actionPath = action
        ? `${staticAction ? "/-static-" : ""}/${action}`
        : "";
    return legacyCall<T>("GET", `${model}${idPath}${actionPath}`, { params });
};

export const legacyPost = <T>(
    model: string,
    {
        action,
        body,
    }: {
        action?: string;
        body?: unknown;
    }
): Promise<T> => {
    const actionPath = action ? `/-static-/${action}` : "";
    return legacyCall<T>("POST", `${model}${actionPath}`, { body });
};
