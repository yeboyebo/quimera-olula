import { QAvatar, QTarjetaGenerica } from "@olula/componentes/index.js";
import { formatearFechaDate, formatearMoneda } from "@olula/lib/dominio.ts";
import { ReactNode } from "react";
import "./TarjetaDocumentoVenta.css";

export type EstadoDocumento = "cerrado" | "pendiente";

export const TarjetaDocumentoVenta = ({
  codigo,
  nombreCliente,
  fecha,
  total,
  estado,
  divisa = "EUR",
  etiqueta,
}: {
  codigo: string;
  nombreCliente: string;
  fecha: Date;
  total: number;
  estado: EstadoDocumento;
  divisa?: string;
  etiqueta?: ReactNode;
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
          {etiqueta}
        </span>
      }
      abajoIzquierda={fecha ? formatearFechaDate(new Date(fecha)) : ""}
      abajoDerecha={formatearMoneda(total, divisa)}
    />
  );
};
