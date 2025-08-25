import { QBoton } from "../../../../../../componentes/atomos/qboton.tsx";
import { QDate } from "../../../../../../componentes/atomos/qdate.tsx";
import { QInput } from "../../../../../../componentes/atomos/qinput.tsx";
import { Proveedor } from "../../../../../../contextos/compras/comun/componentes/proveedor.tsx";
import { Empresa } from "../../../../../../contextos/crm/comun/componentes/empresa.tsx";
import { Cliente } from "../../../../../../contextos/ventas/comun/componentes/cliente.tsx";
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
          <h2><span>{evento.descripcion}</span></h2>
          <div className="fila-1">
            <QInput label="Producto" valor={evento.descripcion_ref || ""} deshabilitado />
          </div>
          <div className="fila-2">
            <QDate label="Fecha" valor={evento.fecha_inicio} deshabilitado />
            <QInput label="Hora inicio" valor={evento.hora_inicio || ""} deshabilitado />
          </div>
          <div className="fila-3">
            <QInput label="Lugar" valor={evento.lugar || ""} deshabilitado />
            <QInput label="Dirección" valor={evento.direccion || ""} deshabilitado />                  
          </div>
          <div className="fila-4">
            <Empresa
              label="Empresa que factura"
              valor={evento.empresa_id || ""}
              descripcion={evento.nombre_empresa || ""}
              deshabilitado
            />
            <Cliente
              valor={evento.cliente_id || ""}
              descripcion={evento.nombre_cliente || ""}
              deshabilitado
            />
            <Proveedor
              valor={evento.proveedor_id || ""}
              descripcion={evento.nombre_proveedor || ""}
              deshabilitado
            />
          </div>
          <div className="fila-botones">
            <QBoton 
              onClick={() => window.location.href = `/eventos/calendario/evento/${evento.evento_id}`}
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