import { useState } from "react";
import { QIcono } from "../../../../../../componentes/atomos/qicono.tsx";
import { TextoConTooltip } from "../../../comun/componentes/TextoConTooltip";
import { Evento } from "../diseño.ts";

const AccionBooleana = ({ campo, valor, evento, onClick }: { campo: keyof Evento; valor: boolean; evento: Evento; onClick: (e: Evento, v: boolean) => void }) => (
  <span className="accion-campo" onClick={() => onClick({ ...evento, [campo]: !valor }, !valor)} title={`Cambiar ${campo}`}>
    <QIcono nombre={valor ? "verdadero" : "falso"} color={valor ? "green" : "red"} />
  </span>
);

const EstadoEvento = ({ estado }: { estado: string | null }) => {
  const [tooltip, setTooltip] = useState<{ show: boolean; top: number; left: number }>({ show: false, top: 0, left: 0 });
  
  const onMouseEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ show: true, top: rect.top - 40, left: rect.left + rect.width / 2 });
  };  
  
  return (
    <span 
      className="indicador-estado" 
      style={{ background: estado === "Confirmado" ? "green" : "red" }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={() => setTooltip(prev => ({ ...prev, show: false }))}
    >
      {tooltip.show && (
        <div className="tooltip-custom" style={{ top: tooltip.top, left: tooltip.left, transform: 'translateX(-50%)' }}>
          {!!estado && estado.length > 0 ? estado : "Sin estado"}
        </div>
      )}
    </span>
  );
};

const cabeceras = {
  presupuesto: "Presupuesto", enviado_a_cliente: "C. cli. enviado", recibido_por_cliente: "C. cli. recibido",
  enviado_a_proveedor: "C. prov. enviado", recibido_por_proveedor: "C. prov. recibido", factura_enviada: "F. enviada",
  hoja_ruta_hecha: "H.R hecha", hoja_ruta_enviada: "H.R. mandada", altas_ss: "Altas SS.SS",
  carteleria: "Carteleria", liquidacion: "Liquidacion"
};

export const getMetaTablaEvento = (onChange: (evento: Evento, valor: boolean) => void) => [
  { id: "estado_id", cabecera: "", ancho: "30px", render: (e: Evento) => <EstadoEvento estado={e.estado_id} /> },
  { id: "descripcion", cabecera: "Nombre", tipo: "texto", ancho: "200px", render: (e: Evento) => <span className="enlace-detalle" onClick={() => window.location.href = `/eventos/evento/${e.evento_id}`}><TextoConTooltip texto={e.descripcion} /></span> },
  { id: "fecha_inicio", cabecera: "Fecha", tipo: "fecha" },
  { id: "lugar", cabecera: "Lugar", tipo: "texto", render: (e: Evento) => <TextoConTooltip texto={e.lugar} /> },
  { id: "hora_inicio", cabecera: "Horario", tipo: "hora", ancho: "80px" },
  { id: "nombre_cliente", cabecera: "P. Cliente", tipo: "texto", ancho: "200px", render: (e: Evento) => <TextoConTooltip texto={e.nombre_cliente} /> },
  { id: "nombre_proveedor", cabecera: "P. Prov.", tipo: "texto", ancho: "200px", render: (e: Evento) => <TextoConTooltip texto={e.nombre_proveedor} /> },
  { id: "nombre_empresa", cabecera: "Empresa fact.", tipo: "texto", ancho: "200px", render: (e: Evento) => <TextoConTooltip texto={e.nombre_empresa} /> },
  ...["presupuesto", "enviado_a_cliente", "recibido_por_cliente", "enviado_a_proveedor", "recibido_por_proveedor", "factura_enviada", "hoja_ruta_hecha", "hoja_ruta_enviada", "altas_ss", "carteleria", "liquidacion"].map(campo => ({
    id: campo, cabecera: cabeceras[campo as keyof typeof cabeceras] || campo, tipo: "booleano", ancho: "115px",
    render: (e: Evento) => <AccionBooleana campo={campo as keyof Evento} valor={!!e[campo as keyof Evento]} evento={e} onClick={onChange} />
  }))
];

