import { QAvatar, QEtiqueta, QTarjetaGenerica } from "@olula/componentes/index.js";
import { Cliente } from "../diseño.ts";

export const TarjetaCliente = (cliente: Cliente) => (
  <QTarjetaGenerica
    avatar={<QAvatar nombre={cliente.nombre} />}
    arribaIzquierda={cliente.nombre}
    arribaDerecha={
      cliente.de_baja ? (
        <QEtiqueta variante="advertencia">De baja</QEtiqueta>
      ) : undefined
    }
    abajoIzquierda={cliente.email}
    abajoDerecha={cliente.telefono1}
  />
);
