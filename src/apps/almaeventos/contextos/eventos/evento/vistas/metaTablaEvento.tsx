import { useState } from "react";
import { QIcono } from "../../../../../../componentes/atomos/qicono.tsx";
import { Evento } from "../diseño.ts";
import { TextoConTooltip } from "../../../comun/componentes/TextoConTooltip";

const AccionBooleana = ({ campo, valor, evento, onClick }: { campo: keyof Evento; valor: boolean; evento: Evento; onClick: (e: Evento, v: boolean) => void }) => (
  <span className="accion-campo" onClick={() => onClick({ ...evento, [campo]: !valor }, !valor)} title={`Cambiar ${campo}`}>
    <QIcono nombre={valor ? "verdadero" : "falso"} color={valor ? "green" : "red"} />
  </span>
);

const cabeceras = {
  presupuesto: "Presupuesto", enviado_a_cliente: "C. cli. enviado", recibido_por_cliente: "C. cli. recibido",
  enviado_a_proveedor: "C. prov. enviado", recibido_por_proveedor: "C. prov. recibido", factura_enviada: "F. enviada",
  hoja_ruta_hecha: "H.R hecha", hoja_ruta_enviada: "H.R. mandada", altas_ss: "Altas SS.SS",
  carteleria: "Carteleria", liquidacion: "Liquidacion"
};

export const getMetaTablaEvento = (onChange: (evento: Evento, valor: boolean) => void) => [
  { id: "estado_id", cabecera: "", render: (e: Evento) => <span className="indicador-estado" style={{ background: e.estado_id === "Confirmado" ? "green" : "red" }} title={e.estado_id ?? undefined} /> },
  { id: "descripcion", cabecera: "Nombre", tipo: "texto", render: (e: Evento) => <span className="enlace-detalle" onClick={() => window.location.href = `/eventos/evento/${e.evento_id}`}><TextoConTooltip texto={e.descripcion} /></span> },
  { id: "fecha_inicio", cabecera: "Fecha", tipo: "fecha" },
  { id: "lugar", cabecera: "Lugar", tipo: "texto", render: (e: Evento) => <TextoConTooltip texto={e.lugar} /> },
  { id: "hora_inicio", cabecera: "Horario", tipo: "hora" },
  { id: "nombre_cliente", cabecera: "P. Cliente", tipo: "texto", render: (e: Evento) => <TextoConTooltip texto={e.nombre_cliente} /> },
  { id: "nombre_proveedor", cabecera: "P. Prov.", tipo: "texto", render: (e: Evento) => <TextoConTooltip texto={e.nombre_proveedor} /> },
  { id: "nombre_empresa", cabecera: "Empresa fact.", tipo: "texto", render: (e: Evento) => <TextoConTooltip texto={e.nombre_empresa} /> },
  ...["presupuesto", "enviado_a_cliente", "recibido_por_cliente", "enviado_a_proveedor", "recibido_por_proveedor", "factura_enviada", "hoja_ruta_hecha", "hoja_ruta_enviada", "altas_ss", "carteleria", "liquidacion"].map(campo => ({
    id: campo, cabecera: cabeceras[campo as keyof typeof cabeceras] || campo, tipo: "booleano",
    render: (e: Evento) => <AccionBooleana campo={campo as keyof Evento} valor={e[campo as keyof Evento] as boolean} evento={e} onClick={onChange} />
  }))
];

