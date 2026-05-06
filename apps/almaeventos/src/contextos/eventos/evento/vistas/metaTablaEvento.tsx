import { TextoConTooltip } from "../../../comun/componentes/TextoConTooltip";
import { AccionBooleana } from "../componentes/AccionBooleana";
import { EstadoEvento } from "../componentes/EstadoEvento";
import { Evento } from "../diseño.ts";

const cabeceras = {
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
  liquidacion: "Liquidacion",
};

export const getMetaTablaEvento = (
  onChange: (evento: Evento, valor: boolean) => void
) => [
  {
    id: "estado_id",
    cabecera: "",
    ancho: "30px",
    render: (e: Evento) => <EstadoEvento estado={e.estado_id} />,
  },
  {
    id: "descripcion",
    cabecera: "Nombre",
    tipo: "texto" as const,
    ancho: "200px",
    render: (e: Evento) => (
      <span
        className="enlace-detalle"
        onClick={() =>
          (window.location.href = `/eventos/evento/${e.evento_id}`)
        }
      >
        <TextoConTooltip texto={e.descripcion} />
      </span>
    ),
  },
  {
    id: "fechaInicio",
    cabecera: "Fecha",
    tipo: "fecha" as const,
    render: (e: Evento) => {
      if (!e.fechaInicio) return "";
      const fecha =
        e.fechaInicio instanceof Date ? e.fechaInicio : new Date(e.fechaInicio);
      return fecha.toISOString().split("T")[0];
    },
  },
  {
    id: "lugar",
    cabecera: "Lugar",
    tipo: "texto" as const,
    render: (e: Evento) => <TextoConTooltip texto={e.lugar} />,
  },
  {
    id: "hora_inicio",
    cabecera: "Horario",
    tipo: "hora" as const,
    ancho: "80px",
  },
  {
    id: "nombre_cliente",
    cabecera: "P. Cliente",
    tipo: "texto" as const,
    ancho: "200px",
    render: (e: Evento) => <TextoConTooltip texto={e.nombre_cliente} />,
  },
  {
    id: "nombre_proveedor",
    cabecera: "P. Prov.",
    tipo: "texto" as const,
    ancho: "200px",
    render: (e: Evento) => <TextoConTooltip texto={e.nombre_proveedor} />,
  },
  {
    id: "nombre_empresa",
    cabecera: "Empresa fact.",
    tipo: "texto" as const,
    ancho: "200px",
    render: (e: Evento) => <TextoConTooltip texto={e.nombre_empresa} />,
  },
  ...[
    "presupuesto",
    "enviado_a_cliente",
    "recibido_por_cliente",
    "enviado_a_proveedor",
    "recibido_por_proveedor",
    "factura_enviada",
    "hoja_ruta_hecha",
    "hoja_ruta_enviada",
    "altas_ss",
    "carteleria",
    "liquidacion",
  ].map((campo) => ({
    id: campo,
    cabecera: cabeceras[campo as keyof typeof cabeceras] || campo,
    tipo: "booleano" as const,
    ancho: "115px",
    render: (e: Evento) => (
      <AccionBooleana
        campo={campo as keyof Evento}
        valor={!!e[campo as keyof Evento]}
        evento={e}
        onClick={onChange}
      />
    ),
  })),
];
