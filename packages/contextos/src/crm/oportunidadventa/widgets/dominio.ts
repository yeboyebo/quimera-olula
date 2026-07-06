import { ClausulaFiltro, Filtro, Orden, Paginacion } from "@olula/lib/diseño.ts";
import {
    getEstadosOportunidadVenta,
    getOportunidadesVenta,
} from "../infraestructura.ts";

export type EstadoCargaWidget = "cargando" | "listo";

export type ModeloWidgetPrevision = {
    estado: EstadoCargaWidget;
    oportunidadesAbiertas: number;
    previsionPotencial: number;
    urlVer: string;
};

const RUTA_OPO_VENTA = "/crm/oportunidadventa";
const PAGINACION_INICIAL: Paginacion = { pagina: 1, limite: 200 };
const ORDEN_DEFECTO: Orden = ["probabilidad", "DESC"];

export const modeloWidgetPrevisionInicial: ModeloWidgetPrevision = {
    estado: "cargando",
    oportunidadesAbiertas: 0,
    previsionPotencial: 0,
    urlVer: RUTA_OPO_VENTA,
};

const construirUrlConFiltro = (filtro: ClausulaFiltro[]): string => {
    if (filtro.length === 0) return RUTA_OPO_VENTA;

    const params = new URLSearchParams();
    for (const [campo, operador, valor] of filtro) {
        params.append(campo, valor === undefined ? operador : `${operador}__${valor}`);
    }

    return `${RUTA_OPO_VENTA}?${params.toString()}`;
};

const construirFiltroAbiertas = (idsTerminales: string[]): ClausulaFiltro[] =>
    [["estado_id", "!in", idsTerminales.join(",")] as unknown as ClausulaFiltro];

const construirFiltroApiAbiertas = (idsTerminales: string[]): Filtro => {
    if (idsTerminales.length === 0) return [] as unknown as Filtro;

    return [["estado_id", "!in", idsTerminales as unknown as string]] as unknown as Filtro;
};

const cargarOportunidades = async (
    filtro: Filtro,
    orden: Orden
) => {
    const primera = await getOportunidadesVenta(filtro, orden, PAGINACION_INICIAL);
    const datos = [...primera.datos];
    let pagina = PAGINACION_INICIAL.pagina + 1;

    while (datos.length < primera.total) {
        const siguiente = await getOportunidadesVenta(filtro, orden, {
            ...PAGINACION_INICIAL,
            pagina,
        });
        datos.push(...siguiente.datos);
        pagina += 1;
    }

    return datos;
};

const obtenerIdsEstadosTerminales = async (): Promise<string[]> => {
    const estados = await getEstadosOportunidadVenta(
        [] as unknown as Filtro,
        ["id"] as unknown as Orden
    );

    // Estados terminales: perdidas (0) y ganadas (100)
    return estados
        .filter((estado) => estado.probabilidad === 0 || estado.probabilidad === 100)
        .map((estado) => String(estado.id));
};

const calcularPrevision = (
    oportunidades: Array<{ importe: number; probabilidad: number }>
) =>
    oportunidades.reduce(
        (acumulado, oportunidad) =>
            acumulado + (oportunidad.importe * oportunidad.probabilidad) / 100,
        0
    );

const cargarOportunidadesAbiertas = async (idsTerminales: string[]) => {
    const filtro = construirFiltroAbiertas(idsTerminales);
    const filtroApi = construirFiltroApiAbiertas(idsTerminales);
    const oportunidades = await cargarOportunidades(
        filtroApi,
        ORDEN_DEFECTO
    );

    return { oportunidades, filtro };
};

export const cargarModeloWidgetPrevision = async (): Promise<ModeloWidgetPrevision> => {
    const idsTerminales = await obtenerIdsEstadosTerminales();
    const { oportunidades, filtro } = await cargarOportunidadesAbiertas(idsTerminales);

    return {
        estado: "listo",
        oportunidadesAbiertas: oportunidades.length,
        previsionPotencial: calcularPrevision(oportunidades),
        urlVer: construirUrlConFiltro(filtro),
    };
};
