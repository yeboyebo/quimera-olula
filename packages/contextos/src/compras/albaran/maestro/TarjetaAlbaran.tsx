import { QAvatar, QEtiqueta, QTarjetaGenerica } from "@olula/componentes/index.js";
import { formatearFechaDate, formatearMoneda } from "@olula/lib/dominio.ts";
import { Albaran } from "../diseño.ts";
import { albaranFacturado } from "../dominio.ts";

export const TarjetaAlbaran = (albaran: Albaran) => (
  <QTarjetaGenerica
    avatar={<QAvatar nombre={albaran.nombreProveedor || albaran.codigo} />}
    arribaIzquierda={
      albaran.codigo +
      (albaran.nombreProveedor ? ` · ${albaran.nombreProveedor}` : "")
    }
    arribaDerecha={
      albaranFacturado(albaran) ? (
        <QEtiqueta variante="exito">Facturado</QEtiqueta>
      ) : undefined
    }
    abajoIzquierda={albaran.fecha ? formatearFechaDate(albaran.fecha) : ""}
    abajoDerecha={formatearMoneda(albaran.total, albaran.divisaId)}
  />
);
