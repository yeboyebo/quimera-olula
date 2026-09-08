import { QAvatar, QEtiqueta, QTarjetaGenerica } from "@olula/componentes/index.js";
import { Proveedor } from "../diseño.ts";

export const TarjetaProveedor = (proveedor: Proveedor) => (
  <QTarjetaGenerica
    avatar={<QAvatar nombre={proveedor.nombre} />}
    arribaIzquierda={proveedor.nombre}
    arribaDerecha={
      proveedor.deBaja ? (
        <QEtiqueta variante="advertencia">De baja</QEtiqueta>
      ) : undefined
    }
    abajoIzquierda={proveedor.email}
    abajoDerecha={proveedor.telefono1}
  />
);
