import { ClausulaFiltro, Filtro, Orden, Paginacion } from "@olula/lib/diseño.ts";
import {
    getEstadosOportunidadVenta,
    getOportunidadesVenta,
} from "../infraestructura.ts";

export type EstadoCargaWidget = "cargando" | "listo";

export type SerieEstadoPrevision = {
    estadoId: string;
    estadoDescripcion: string;
    probabilidad: number;
    oportunidades: number;
    importeTotal: number;
    prevision: number;
};

export type ModeloWidgetPrevision = {
    estado: EstadoCargaWidget;
    oportunidadesAbiertas: number;
    previsionPotencial: number;
    seriePorEstado: SerieEstadoPrevision[];
    urlVer: string;
};

const RUTA_OPO_VENTA = "/crm/oportunidadventa";
const PAGINACION_INICIAL: Paginacion = { pagina: 1, limite: 200 };
const ORDEN_DEFECTO: Orden = ["probabilidad", "DESC"];

export const modeloWidgetPrevisionInicial: ModeloWidgetPrevision = {
    estado: "cargando",
    oportunidadesAbiertas: 0,
    previsionPotencial: 0,
    seriePorEstado: [],
    urlVer: RUTA_OPO_VENTA,
};

const construirUrlConFiltro = (filtro: ClausulaFiltro[]): string => {
    const params = new URLSearchParams();
    params.set("modo", "kanban");

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

const cargarOportunidadesAbiertas = async (idsTerminales: string[]) => {
    const filtro = construirFiltroAbiertas(idsTerminales);
    const filtroApi = construirFiltroApiAbiertas(idsTerminales);
    const oportunidades = await cargarOportunidades(
        filtroApi,
        ORDEN_DEFECTO
    );

    return { oportunidades, filtro };
};

const agruparPrevisionPorEstado = (
    oportunidades: Array<{ estado_id: string; descripcion_estado: string | null; importe: number; probabilidad: number }>,
    probabilidadesPorEstado: Map<string, number>
): SerieEstadoPrevision[] => {
    const acumulado = new Map<string, SerieEstadoPrevision>();

    for (const oportunidad of oportunidades) {
        const estadoId = String(oportunidad.estado_id);
        const probabilidad = probabilidadesPorEstado.get(estadoId) ?? oportunidad.probabilidad ?? 0;
        const existente = acumulado.get(estadoId);

        if (!existente) {
            acumulado.set(estadoId, {
                estadoId,
                estadoDescripcion: oportunidad.descripcion_estado ?? `Estado ${estadoId}`,
                probabilidad,
                oportunidades: 1,
                importeTotal: oportunidad.importe,
                prevision: (oportunidad.importe * probabilidad) / 100,
            });
            continue;
        }

        existente.oportunidades += 1;
        existente.importeTotal += oportunidad.importe;
        existente.prevision += (oportunidad.importe * probabilidad) / 100;
    }

    return Array.from(acumulado.values()).sort((a, b) => b.prevision - a.prevision);
};

export const cargarModeloWidgetPrevision = async (): Promise<ModeloWidgetPrevision> => {
    const estados = await getEstadosOportunidadVenta(
        [] as unknown as Filtro,
        ["id"] as unknown as Orden
    );

    const idsTerminales = estados
        .filter((estado) => estado.probabilidad === 0 || estado.probabilidad === 100)
        .map((estado) => String(estado.id));

    const probabilidadesPorEstado = new Map(
        estados.map((estado) => [String(estado.id), estado.probabilidad])
    );

    const { oportunidades, filtro } = await cargarOportunidadesAbiertas(idsTerminales);
    const seriePorEstado = agruparPrevisionPorEstado(oportunidades, probabilidadesPorEstado);

    return {
        estado: "listo",
        oportunidadesAbiertas: oportunidades.length,
        previsionPotencial: seriePorEstado.reduce((acc, item) => acc + item.prevision, 0),
        seriePorEstado,
        urlVer: construirUrlConFiltro(filtro),
    };
};
