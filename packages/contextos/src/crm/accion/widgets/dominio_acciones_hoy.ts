import { ClausulaFiltro, Filtro, Orden, Paginacion } from "@olula/lib/diseño.ts";
import {
    construirUrlConFiltro,
    EstadoCargaWidget,
    fechaLocalStr
} from "../../widgets/comun.ts";
import { Accion } from "../diseño.ts";
import { getAcciones } from "../infraestructura.ts";

export type GrupoAccionesHoy = {
    tipo: string;
    acciones: Accion[];
};

export type ModeloWidgetAccionesHoy = {
    estado: EstadoCargaWidget;
    totalAcciones: number;
    grupos: GrupoAccionesHoy[];
    urlVer: string;
};

const RUTA_ACCIONES = "/crm/accion";
const ORDEN_ACCIONES: Orden = ["tipo", "ASC", "fecha", "ASC", "id", "DESC"] as unknown as Orden;
const PAGINACION_ACCIONES: Paginacion = { pagina: 1, limite: 200 };

export const modeloWidgetAccionesHoyInicial: ModeloWidgetAccionesHoy = {
    estado: "cargando",
    totalAcciones: 0,
    grupos: [],
    urlVer: RUTA_ACCIONES,
};

const agruparPorTipo = (acciones: Accion[]): GrupoAccionesHoy[] => {
    const grupos = new Map<string, Accion[]>();

    for (const accion of acciones) {
        const tipo = accion.tipo || "Sin tipo";
        const lista = grupos.get(tipo) ?? [];
        lista.push(accion);
        grupos.set(tipo, lista);
    }

    return Array.from(grupos.entries())
        .sort(([tipoA], [tipoB]) => tipoA.localeCompare(tipoB))
        .map(([tipo, accionesGrupo]) => ({ tipo, acciones: accionesGrupo }));
};

export const cargarModeloWidgetAccionesHoy = async (): Promise<ModeloWidgetAccionesHoy> => {
    const hoy = fechaLocalStr(new Date());
    const filtro: ClausulaFiltro[] = [
        ["fecha", "<>", `${hoy}_${hoy}`] as ClausulaFiltro,
    ];



    const resultado = await getAcciones(
        filtro as unknown as Filtro,
        ORDEN_ACCIONES,
        PAGINACION_ACCIONES
    );

    return {
        estado: "listo",
        totalAcciones: resultado.total,
        grupos: agruparPorTipo(resultado.datos),
        urlVer: construirUrlConFiltro(RUTA_ACCIONES, filtro),
    };
};