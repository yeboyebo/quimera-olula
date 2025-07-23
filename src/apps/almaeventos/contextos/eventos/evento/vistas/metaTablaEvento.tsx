import { QIcono } from "../../../../../../componentes/atomos/qicono.tsx";
import { Evento } from "../diseño.ts";

// Componente para mostrar texto con ellipsis
export const TextoEllipsis = ({ texto, maxLength = 30 }: { texto: string | null, maxLength?: number }) => {
  if (!texto) return null;
  
  const textoRecortado = texto.length > maxLength ? 
    `${texto.substring(0, maxLength)}...` : 
    texto;
  
  return <span className="texto-ellipsis" title={texto}>{textoRecortado}</span>;
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
    cabecera: "Estado",
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
        onClick={() => window.location.href = `/eventos/evento/${e.id}`}
        title="Ver detalle"
      >
        <TextoEllipsis texto={e.descripcion} maxLength={30} />
      </span>
    ),
  },
  { id: "fecha_inicio", cabecera: "Fecha" },
  { 
    id: "lugar", 
    cabecera: "Lugar",
    render: (e: Evento) => <TextoEllipsis texto={e.lugar} maxLength={25} />
  },
  { id: "hora_inicio", cabecera: "Horario" },
  { 
    id: "cliente_nombre", 
    cabecera: "P. Cliente",
    render: (e: Evento) => <TextoEllipsis texto={e.cliente_nombre} maxLength={20} />
  },
  { 
    id: "proveedor_nombre", 
    cabecera: "P. Prov.",
    render: (e: Evento) => <TextoEllipsis texto={e.proveedor_nombre} maxLength={20} />
  },
  { 
    id: "empresa_nombre", 
    cabecera: "Empresa fact.",
    render: (e: Evento) => <TextoEllipsis texto={e.empresa_nombre} maxLength={20} />
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