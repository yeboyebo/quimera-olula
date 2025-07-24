import { QIcono } from "../../../../../../componentes/atomos/qicono.tsx";
import { Evento } from "../diseño.ts";

import { useState } from "react";

// Componente para mostrar texto con ellipsis y tooltip
export const TextoEllipsis = ({ texto, maxLength = 30 }: { texto: string | null, maxLength?: number }) => {
  const [mostrarTooltip, setMostrarTooltip] = useState(false);
  const [posicionTooltip, setPosicionTooltip] = useState({ top: 0, left: 0 });
  
  if (!texto) return null;
  
  const textoRecortado = texto.length > maxLength ? 
    `${texto.substring(0, maxLength)}...` : 
    texto;
  
  // Solo mostrar tooltip si el texto está recortado
  const textoEstaRecortado = texto.length > maxLength;
  
  const handleMouseEnter = (e: React.MouseEvent) => {
    if (!textoEstaRecortado) return; // No mostrar tooltip si no está recortado
    
    const rect = e.currentTarget.getBoundingClientRect();
    const tooltipWidth = Math.min(texto.length * 8, window.innerWidth * 0.9); // Estimación del ancho
    
    let left = rect.left + rect.width / 2;
    
    // Ajustar si se sale por la izquierda
    if (left - tooltipWidth / 2 < 10) {
      left = tooltipWidth / 2 + 10;
    }
    // Ajustar si se sale por la derecha
    else if (left + tooltipWidth / 2 > window.innerWidth - 10) {
      left = window.innerWidth - tooltipWidth / 2 - 10;
    }
    
    setPosicionTooltip({
      top: rect.top - 40, // 40px arriba del elemento
      left: left
    });
    setMostrarTooltip(true);
  };
  
  return (
    <span 
      className="texto-ellipsis-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setMostrarTooltip(false)}
    >
      <span className="texto-ellipsis">{textoRecortado}</span>
      {mostrarTooltip && textoEstaRecortado && (
        <div 
          className="tooltip-custom"
          style={{
            top: posicionTooltip.top,
            left: posicionTooltip.left,
            transform: 'translateX(-50%)'
          }}
        >
          {texto}
        </div>
      )}
    </span>
  );
};

// Componente para mostrar y cambiar el estado de un campo booleano
export const AccionCampoEvento = ({
  campo,
  valor,
  evento,
  onClick,
}: {
  campo: keyof Evento;
  valor: boolean;
  evento: Evento;
  onClick: (eventoActualizado: Evento, nuevoValor: boolean) => void;
}) => (
  <span
    className="accion-campo"
    onClick={() => {
      const actualizado = { ...evento, [campo]: !valor };
      onClick(actualizado, !valor);
    }}
    title={`Cambiar ${campo}`}
  >
    {valor ? <QIcono nombre="verdadero" color="green" /> : <QIcono nombre="falso" color="red" />}
  </span>
);

// Definición de la tabla de eventos
export const getMetaTablaEvento = (
  campoEventoChanged: (evento: Evento, valor: boolean) => void
) => [
  {
    id: "estado_id",
    cabecera: "",
    render: (e: Evento) => (
      <span
        className="indicador-estado"
        style={{
          background: e.estado_id === "Confirmado" ? "green" : "red",
        }}
        title={e.estado_id ?? undefined}
      />
    ),
  },
  {
    id: "descripcion",
    cabecera: "Nombre",
    render: (e: Evento) => (
      <span
        className="enlace-detalle"
        onClick={() => window.location.href = `/eventos/evento/${e.evento_id}`}
      >
        <TextoEllipsis texto={e.descripcion} maxLength={30} />
      </span>
    ),
  },
  { id: "fecha_inicio", cabecera: "Fecha" },
  { 
    id: "lugar", 
    cabecera: "Lugar",
    render: (e: Evento) => <TextoEllipsis texto={e.lugar} maxLength={15} />
  },
  { id: "hora_inicio", cabecera: "Horario" },
  { 
    id: "nombre_cliente", 
    cabecera: "P. Cliente",
    render: (e: Evento) => <TextoEllipsis texto={e.nombre_cliente} maxLength={20} />
  },
  { 
    id: "nombre_proveedor", 
    cabecera: "P. Prov.",
    render: (e: Evento) => <TextoEllipsis texto={e.nombre_proveedor} maxLength={20} />
  },
  { 
    id: "nombre_empresa", 
    cabecera: "Empresa fact.",
    render: (e: Evento) => <TextoEllipsis texto={e.nombre_empresa} maxLength={20} />
  },
  // Campos booleanos
  ...["presupuesto", "enviado_a_cliente", "recibido_por_cliente", 
      "enviado_a_proveedor", "recibido_por_proveedor", "factura_enviada", 
      "hoja_ruta_hecha", "hoja_ruta_enviada", "altas_ss", "carteleria", 
      "liquidacion"].map(campo => ({
    id: campo,
    cabecera: getCabecera(campo),
    render: (e: Evento) => (
      <AccionCampoEvento
        campo={campo as keyof Evento}
        valor={e[campo as keyof Evento] as boolean}
        evento={e}
        onClick={campoEventoChanged}
      />
    ),
  })),
];

// Función auxiliar para obtener la cabecera según el campo
function getCabecera(campo: string): string {
  const cabeceras: Record<string, string> = {
    presupuesto: "Presupuesto",
    enviado_a_cliente: "C. cli. enviado",
    recibido_por_cliente: "C. cli. recibido",
    enviado_a_proveedor: "C. prov. enviado",
    recibido_por_proveedor: "C. prov. recibido",
    factura_enviada: "F. enviada",
    hoja_ruta_hecha: "H.R hecha",
    hoja_ruta_enviada: "H.R. mandada",
    altas_ss: "Altas SS.SS",
    carteleria: "Carteleria",
    liquidacion: "Liquidacion"
  };
  
  return cabeceras[campo] || campo;
}