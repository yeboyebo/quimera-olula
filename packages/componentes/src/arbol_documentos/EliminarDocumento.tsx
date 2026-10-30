import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import {
  DocumentosAPI,
  esCarpetaArbol,
  NodoArbol,
} from "@olula/lib/api/documentos.ts";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useCallback } from "react";

/**
 * Modal de confirmación de borrado de un nodo del árbol documental.
 *
 * Sirve para documentos y para carpetas. Borrar una carpeta se lleva todo lo
 * que contiene, así que el mensaje lo advierte: es una acción irreversible y
 * desde el árbol no se ve cuánto cuelga de una carpeta cerrada.
 *
 * Patrón:
 *   - El padre lo renderiza condicionalmente cuando estado === "eliminando_documento".
 *   - Llama a DocumentosAPI.eliminar internamente y emite:
 *       "documento_eliminado"              sin payload (éxito, recarga el árbol)
 *       "eliminacion_documento_cancelada"  sin payload (cancelar)
 *   - No recibe prop `activo`; la visibilidad la controla el padre.
 */
export interface EliminarDocumentoProps {
  nodo: NodoArbol;
  publicar: EmitirEvento;
}

const mensajeDe = (nodo: NodoArbol): string => {
  if (!esCarpetaArbol(nodo)) {
    return `¿Está seguro de que desea eliminar el documento ${nodo.nombre}?`;
  }

  const vacia = nodo.contenido.length === 0;

  return vacia
    ? `¿Está seguro de que desea eliminar la carpeta ${nodo.nombre}?`
    : `¿Está seguro de que desea eliminar la carpeta ${nodo.nombre} ` +
        `y todo su contenido? Se eliminarán también las subcarpetas y los ` +
        `documentos que contenga.`;
};

export const EliminarDocumento = ({
  nodo,
  publicar,
}: EliminarDocumentoProps) => {
  const esCarpeta = esCarpetaArbol(nodo);

  const eliminar = useCallback(async () => {
    await DocumentosAPI.eliminar(nodo.id);
    publicar("documento_eliminado");
  }, [nodo, publicar]);

  const cancelar = useCallback(
    () => publicar("eliminacion_documento_cancelada"),
    [publicar]
  );

  return (
    <QModalConfirmacion
      nombre="eliminarDocumento"
      abierto={true}
      titulo={esCarpeta ? "Eliminar carpeta" : "Eliminar documento"}
      mensaje={mensajeDe(nodo)}
      onCerrar={cancelar}
      onAceptar={eliminar}
      labelAceptar="Eliminar"
    />
  );
};
