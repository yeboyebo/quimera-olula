import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { DocumentoArbol, DocumentosAPI } from "@olula/lib/api/documentos.ts";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useCallback } from "react";

/**
 * Modal de confirmación de borrado de un documento del árbol documental.
 *
 * Patrón:
 *   - El padre lo renderiza condicionalmente cuando estado === "eliminando_documento".
 *   - Llama a DocumentosAPI.eliminar internamente y emite:
 *       "documento_eliminado"              sin payload (éxito, recarga el árbol)
 *       "eliminacion_documento_cancelada"  sin payload (cancelar)
 *   - No recibe prop `activo`; la visibilidad la controla el padre.
 */
export interface EliminarDocumentoProps {
  documento: DocumentoArbol;
  publicar: EmitirEvento;
}

export const EliminarDocumento = ({
  documento,
  publicar,
}: EliminarDocumentoProps) => {
  const eliminar = useCallback(async () => {
    await DocumentosAPI.eliminar(documento.id);
    publicar("documento_eliminado");
  }, [documento, publicar]);

  const cancelar = useCallback(
    () => publicar("eliminacion_documento_cancelada"),
    [publicar]
  );

  return (
    <QModalConfirmacion
      nombre="eliminarDocumento"
      abierto={true}
      titulo="Eliminar documento"
      mensaje={`¿Está seguro de que desea eliminar el documento ${documento.nombre}?`}
      onCerrar={cancelar}
      onAceptar={eliminar}
      labelAceptar="Eliminar"
    />
  );
};
