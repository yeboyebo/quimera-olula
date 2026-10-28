import { ClausulaFiltro, Criteria, Filtro } from "@olula/lib/diseño.ts";
import { criteriaDefecto } from "@olula/lib/dominio.ts";
import { ejercicioActual } from "#/contabilidad/asiento/dominio.ts";
import { TipoInformeContableReport } from "./diseño.ts";

export { ejercicioActual };

export interface FiltrosInformePeriodo {
    ejercicioId: string;
    fechaDesde?: string;
    fechaHasta?: string;
}

const clausulasPeriodo = ({
    ejercicioId,
    fechaDesde,
    fechaHasta,
}: FiltrosInformePeriodo): ClausulaFiltro[] => {
    const clausulas: ClausulaFiltro[] = [["ejercicio_id", "eq", ejercicioId]];
    if (fechaDesde?.trim()) {
        clausulas.push(["fecha", ">=", fechaDesde.trim()]);
    }
    if (fechaHasta?.trim()) {
        clausulas.push(["fecha", "<=", fechaHasta.trim()]);
    }
    return clausulas;
};

export const criteriaInformePeriodo = (filtros: FiltrosInformePeriodo): Criteria => ({
    ...criteriaDefecto,
    filtro: clausulasPeriodo(filtros) as Filtro,
});

export const criteriaInformeMayor = (
    filtros: FiltrosInformePeriodo & { subcuentaId: string }
): Criteria => ({
    ...criteriaDefecto,
    filtro: [...clausulasPeriodo(filtros), ["subcuenta_id", "eq", filtros.subcuentaId]] as Filtro,
});

const NOMBRES_PDF_INFORME: Record<TipoInformeContableReport, string> = {
    mayor: "mayor.pdf",
    diario: "diario.pdf",
    libro_facturas_emitidas: "informe-facturas-emitidas.pdf",
    libro_facturas_recibidas: "informe-facturas-recibidas.pdf",
};

export const nombreFicheroPdfInforme = (tipo: TipoInformeContableReport): string =>
    NOMBRES_PDF_INFORME[tipo];
