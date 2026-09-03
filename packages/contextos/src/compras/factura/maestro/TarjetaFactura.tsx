import { QAvatar, QEtiqueta, QTarjetaGenerica } from "@olula/componentes/index.js";
import { formatearFechaDate, formatearMoneda } from "@olula/lib/dominio.ts";
import { Factura } from "../diseño.ts";

export const TarjetaFactura = (factura: Factura) => (
  <QTarjetaGenerica
    avatar={<QAvatar nombre={factura.nombreProveedor || factura.codigo} />}
    arribaIzquierda={
      factura.codigo +
      (factura.nombreProveedor ? ` · ${factura.nombreProveedor}` : "")
    }
    arribaDerecha={
      factura.deAbono ? (
        <QEtiqueta variante="advertencia">Abono</QEtiqueta>
      ) : !factura.editable ? (
        <QEtiqueta variante="primario">Cerrada</QEtiqueta>
      ) : undefined
    }
    abajoIzquierda={factura.fecha ? formatearFechaDate(factura.fecha) : ""}
    abajoDerecha={formatearMoneda(factura.total, factura.divisaId)}
  />
);
