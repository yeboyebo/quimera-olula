import { Proveedor } from "#/compras/comun/componentes/proveedor.tsx";
import { Empresa } from "#/crm/comun/componentes/empresa.tsx";
import { Cliente } from "#/ventas/comun/componentes/cliente.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QDate } from "@olula/componentes/atomos/qdate.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { EventoCalendario } from "../diseño.ts";
import "./FichaEventoAbierto.css";

interface FichaEventoAbiertoProps {
  evento: EventoCalendario;
}

export const FichaEventoAbierto = ({ evento }: FichaEventoAbiertoProps) => {
  return (
    <div className="ficha-evento">
      <quimera-formulario>
        <div className="columna-principal">
          <h2>
            <span>{evento.descripcion}</span>
          </h2>
          <div className="fila-1">
            <QInput
              nombre="descripcion_ref"
              label="Producto"
              valor={
                typeof evento.descripcion_ref === "string"
                  ? evento.descripcion_ref
                  : ""
              }
              deshabilitado
            />
          </div>
          <div className="fila-2">
            <QDate
              nombre="fecha"
              label="Fecha"
              valor={
                typeof evento.fecha_inicio === "string"
                  ? evento.fecha_inicio
                  : evento.fecha_inicio instanceof Date
                  ? evento.fecha_inicio.toISOString().substring(0, 10)
                  : ""
              }
              deshabilitado
            />
            <QInput
              nombre="hora_inicio"
              label="Hora inicio"
              valor={evento.hora_inicio || ""}
              deshabilitado
            />
          </div>
          <div className="fila-3">
            <QInput
              nombre="lugar"
              label="Lugar"
              valor={evento.lugar || ""}
              deshabilitado
            />
            <QInput
              nombre="direccion"
              label="Dirección"
              valor={
                typeof evento.direccion === "string" ? evento.direccion : ""
              }
              deshabilitado
            />
          </div>
          <div className="fila-4">
            <Empresa
              label="Empresa que factura"
              valor={
                typeof evento.empresa_id === "string" ? evento.empresa_id : ""
              }
              descripcion={
                typeof evento.nombre_empresa === "string"
                  ? evento.nombre_empresa
                  : ""
              }
              deshabilitado
            />
            <Cliente
              valor={
                typeof evento.cliente_id === "string" ? evento.cliente_id : ""
              }
              descripcion={
                typeof evento.nombre_cliente === "string"
                  ? evento.nombre_cliente
                  : ""
              }
              deshabilitado
            />
            <Proveedor
              valor={
                typeof evento.proveedor_id === "string"
                  ? evento.proveedor_id
                  : ""
              }
              descripcion={
                typeof evento.nombre_proveedor === "string"
                  ? evento.nombre_proveedor
                  : ""
              }
              deshabilitado
            />
          </div>
          <div className="fila-botones">
            <QBoton
              onClick={() =>
                (window.location.href = `/eventos/calendario/evento/${evento.evento_id}`)
              }
              variante="solido"
            >
              Ver detalle
            </QBoton>
          </div>
        </div>
      </quimera-formulario>
    </div>
  );
};
