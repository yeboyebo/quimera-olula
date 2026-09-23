import { QEtiqueta } from "@olula/componentes/atomos/qetiqueta.tsx";
import { formatearFechaDate } from "@olula/lib/dominio.js";
import { IaMemoria } from "../diseño.js";

interface TabInformacionProps {
    iaMemoria: IaMemoria;
}

/**
 * Tab de solo lectura con los metadatos de auditoría de la memoria.
 */
export const TabInformacion = ({ iaMemoria }: TabInformacionProps) => {
    return (
        <div className="TabInformacion">
            <dl>
                <dt>Estado</dt>
                <dd>{iaMemoria.activo ? "Activo" : "Inactivo"}</dd>
                <dt>Creado por</dt>
                <dd>{iaMemoria.creadoPor || "-"}</dd>
                <dt>Creado en</dt>
                <dd>{formatearFechaDate(iaMemoria.creadoEn)}</dd>
                <dt>Actualizado en</dt>
                <dd>{formatearFechaDate(iaMemoria.actualizadoEn)}</dd>
                <dt>Indexado (RAG)</dt>
                <dd>
                    {iaMemoria.indexado
                        ? `Sí (${iaMemoria.indexadoEn ? formatearFechaDate(iaMemoria.indexadoEn) : "-"})`
                        : "No"}
                    {iaMemoria.modeloDesactualizado && (
                        <>
                            {" "}
                            <QEtiqueta variante="advertencia">
                                Modelo de embeddings desactualizado — conviene reindexar
                            </QEtiqueta>
                        </>
                    )}
                </dd>
            </dl>
        </div>
    );
};
