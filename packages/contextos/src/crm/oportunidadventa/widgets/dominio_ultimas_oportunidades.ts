import { ClausulaFiltro, Filtro, Orden, Paginacion } from "@olula/lib/diseño.ts";
import {
    construirUrlConFiltro,
    EstadoCargaWidget,
    obtenerUsuarioActualId,
} from "../../widgets/comun.ts";
import { OportunidadVenta } from "../diseño.ts";
import { obtenerIdsEstadosTerminales } from "../dominio.ts";
import { getEstadosOportunidadVenta, getOportunidadesVenta } from "../infraestructura.ts";

export type ModeloWidgetUltimasOportunidades = {
    estado: EstadoCargaWidget;
    oportunidades: OportunidadVenta[];
    urlVer: string;
};

const RUTA_OPO_VENTA = "/crm/oportunidadventa";
const ORDEN_ULTIMAS: Orden = ["fecha_cierre", "DESC", "id", "DESC"] as unknown as Orden;
const PAGINACION_ULTIMAS: Paginacion = { pagina: 1, limite: 3 };

export const modeloWidgetUltimasOportunidadesInicial: ModeloWidgetUltimasOportunidades = {
    estado: "cargando",
    oportunidades: [],
    urlVer: RUTA_OPO_VENTA,
};

export const cargarModeloWidgetUltimasOportunidades = async (): Promise<ModeloWidgetUltimasOportunidades> => {
    const usuarioId = obtenerUsuarioActualId();
    const estados = await getEstadosOportunidadVenta(
        [] as unknown as Filtro,
        ["id"] as unknown as Orden
    );
    const idsTerminales = obtenerIdsEstadosTerminales(estados);

    const filtro: ClausulaFiltro[] = [];
    const filtroApi: ClausulaFiltro[] = [];

    if (idsTerminales.length > 0) {
        filtro.push(["estado_id", "!in", idsTerminales.join(",")] as ClausulaFiltro);
        filtroApi.push(["estado_id", "!in", idsTerminales as unknown as string] as ClausulaFiltro);
    }

    if (usuarioId) {
        filtro.push(["usuario_id", "=", usuarioId] as ClausulaFiltro);
        filtroApi.push(["usuario_id", "=", usuarioId] as ClausulaFiltro);
    }

    const resultado = await getOportunidadesVenta(
        filtroApi as unknown as Filtro,
        ORDEN_ULTIMAS,
        PAGINACION_ULTIMAS
    );

    return {
        estado: "listo",
        oportunidades: resultado.datos,
        urlVer: construirUrlConFiltro(RUTA_OPO_VENTA, filtro),
    };
};