import { useEffect } from "react";
import { Criteria, Filtro, Paginacion } from "./diseño.ts";

const formarUrl = (params: URLSearchParams) => {
    const str = params.toString();
    const base = window.location.origin + window.location.pathname;
    const url = base + (str.length ? "?" + str : "");

    return url;
}

export const getIdUrlParams = () => {
    const params = new URLSearchParams(window.location.search);

    return params.get("id") ?? undefined;
};

export const setIdUrlParams = (id: string | undefined) => {
    const params = new URLSearchParams(window.location.search);

    if (!id) params.delete("id");
    else params.set("id", id);

    history.replaceState({}, "", formarUrl(params));
}

const clavesReservadas = ["id", "orden", "p", "l"];

export const filtroDefecto: Filtro = [];

const getFiltro = (params: URLSearchParams) => {
    const filtro = filtroDefecto;

    for (const [k, v] of params.entries()) {
        if (clavesReservadas.includes(k)) continue;

        const valor = v.split("__");

        if (valor.length === 2) filtro.push([k, valor[0], valor[1]]);
        else filtro.push([k, "~", v])
    }

    return filtro;
};

const setFiltro = (criteria: Criteria, params: URLSearchParams) => {
    const { filtro } = criteria;

    filtro.forEach(f => {
        const [campoFiltro, operador, valor] = f;

        if (operador === "~") params.set(campoFiltro, valor ?? "");
        else params.set(campoFiltro, operador + "__" + valor);
    });
}

export const ordenDefecto = ["id", "DESC"];

const getOrden = (params: URLSearchParams) => {
    const orden = params.get("orden");
    if (!orden) return ordenDefecto;

    if (orden.startsWith("-")) return [orden.slice(1), "DESC"];
    return [orden, "ASC"];
};

const setOrden = (criteria: Criteria, params: URLSearchParams) => {
    const { orden } = criteria;

    const [campoOrden, direccion] = orden;
    if (orden.toString() !== ordenDefecto.toString()) params.set("orden", direccion === "ASC" ? campoOrden : "-" + campoOrden);
}

export const paginacionDefecto = { pagina: 1, limite: 10 };

const getPaginacion = (params: URLSearchParams): Paginacion => {
    const p = parseInt(params.get("p") ?? paginacionDefecto.pagina.toString());
    const l = parseInt(params.get("l") ?? paginacionDefecto.limite.toString());

    const pagina = !isNaN(p) ? p : paginacionDefecto.pagina;
    const limite = !isNaN(l) ? l : paginacionDefecto.limite;

    return { pagina, limite };
};

const setPaginacion = (criteria: Criteria, params: URLSearchParams) => {
    const { paginacion: { limite, pagina } } = criteria;

    if (limite && limite !== paginacionDefecto.limite) params.set("l", limite.toString());
    if (pagina && pagina !== paginacionDefecto.pagina) params.set("p", pagina.toString());
}

export const getCriteriaUrlParams = () => {
    const params = new URLSearchParams(window.location.search);

    return {
        filtro: getFiltro(params),
        orden: getOrden(params),
        paginacion: getPaginacion(params),
    }
}

export const setCriteriaUrlParams = (criteria: Criteria) => {
    const previo = new URLSearchParams(window.location.search);
    const id = previo.get("id");

    const params = new URLSearchParams();
    if (id) params.set("id", id);

    setFiltro(criteria, params);
    setOrden(criteria, params);
    setPaginacion(criteria, params);

    history.replaceState({}, "", formarUrl(params));
}

export const getUrlParams = () => {
    const id = getIdUrlParams();
    const criteria = getCriteriaUrlParams();

    return { id, criteria };
}

export const useUrlParams = (id: string | undefined, criteria: Criteria) => {
    useEffect(() => {
        setIdUrlParams(id);
    }, [id]);

    useEffect(() => {
        setCriteriaUrlParams(criteria);
    }, [criteria])
}