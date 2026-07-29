import { QAvatar, QTarjetaGenerica } from "@olula/componentes/index.js";
import { formatearMoneda } from "@olula/lib/dominio.ts";
import "./TarjetaDocumentoVenta.css";

export type EstadoDocumento = "cerrado" | "pendiente";

/**
 * Tarjeta compartida para documentos de venta (pedido, albarán, presupuesto).
 * - Título: código + nombre de cliente (recortado a 2 líneas si es largo).
 * - Avatar coloreado según estado (gris = cerrado, verde = pendiente), como el
 *   icono de estado de la tabla.
 */
export const TarjetaDocumentoVenta = ({
  codigo,
  nombreCliente,
  fecha,
  total,
  estado,
}: {
  codigo: string;
  nombreCliente: string;
  fecha: Date;
  total: number;
  estado: EstadoDocumento;
}) => {
  return (
    <QTarjetaGenerica
      avatar={
        <QAvatar
          nombre={nombreCliente || codigo}
          className={`tarjeta-doc-avatar estado-${estado}`}
        />
      }
      arribaIzquierda={
        <span className="tarjeta-doc-titulo">
          {codigo}
          {nombreCliente ? ` · ${nombreCliente}` : ""}
        </span>
      }
      abajoIzquierda={fecha ? new Date(fecha).toLocaleDateString("es-ES") : ""}
      abajoDerecha={formatearMoneda(total, "EUR")}
    />
  );
};
