import { QAvatar, QEtiqueta, QTarjetaGenerica } from "@olula/componentes/index.js";
import { formatearFechaDate, formatearMoneda } from "@olula/lib/dominio.ts";
import { Pedido } from "../diseño.ts";

const varianteRecibido: Record<string, "exito" | "advertencia" | "primario"> = {
  "Sí": "exito",
  Parcial: "advertencia",
};

export const TarjetaPedido = (pedido: Pedido) => (
  <QTarjetaGenerica
    avatar={<QAvatar nombre={pedido.nombreProveedor || pedido.codigo} />}
    arribaIzquierda={
      pedido.codigo +
      (pedido.nombreProveedor ? ` · ${pedido.nombreProveedor}` : "")
    }
    arribaDerecha={
      pedido.recibido && pedido.recibido !== "No" ? (
        <QEtiqueta variante={varianteRecibido[pedido.recibido] ?? "primario"}>
          {`Recibido: ${pedido.recibido}`}
        </QEtiqueta>
      ) : undefined
    }
    abajoIzquierda={pedido.fecha ? formatearFechaDate(pedido.fecha) : ""}
    abajoDerecha={formatearMoneda(pedido.total, pedido.divisaId)}
  />
);
