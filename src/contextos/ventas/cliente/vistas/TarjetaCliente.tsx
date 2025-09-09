import { Cliente } from "../diseño.ts";
import "./TarjetaCliente.css";

export const TarjetaCliente = ({ cliente }: { cliente: Cliente }) => (
  <div className="tarjeta-cliente">
    <div className="tarjeta-titulo">{cliente.nombre}</div>
    <div className="tarjeta-detalle">ID: {cliente.id}</div>
    <div className="tarjeta-detalle">Email: {cliente.email}</div>
    <div className="tarjeta-detalle">Teléfono: {cliente.telefono1}</div>
    {/* Puedes añadir más campos si lo necesitas */}
  </div>
);
