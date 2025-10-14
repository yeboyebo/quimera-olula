import { QAvatar } from "@olula/componentes/atomos/qavatar.tsx";
import { Cliente } from "../diseño.ts";
import "./TarjetaCliente.css";

export const TarjetaCliente = ({ cliente }: { cliente: Cliente }) => (
  <div className="tarjeta-cliente">
    <div className="columna">
      <div className="tarjeta-icono">
        <QAvatar nombre={cliente.nombre} tamaño="lg" />
      </div>
    </div>
    <div className="columna">
      <div className="tarjeta-titulo">{cliente.nombre}</div>
      <div className="tarjeta-detalle">ID: {cliente.id}</div>
      <div className="tarjeta-detalle">Email: {cliente.email}</div>
      <div className="tarjeta-detalle">Teléfono: {cliente.telefono1}</div>
    </div>
  </div>
);
