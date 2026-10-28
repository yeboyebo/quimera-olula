import { ClausulaFiltro, Filtro } from "@olula/lib/diseño.ts";
import { formatearMoneda } from "@olula/lib/dominio.ts";
import {
  CampoWidget,
  ConfigWidgets,
  DefinicionWidget,
  FormatoWidget,
  OperacionWidget,
  RecursoAgregable,
} from "./diseño.ts";

/** Parámetro `metricas` del servidor: `suma:total`, `conteo`... */
export const metricaWidget = (widget: DefinicionWidget): string =>
  widget.campo ? `${widget.operacion}:${widget.campo}` : widget.operacion;

/** Clave con la que el servidor devuelve la métrica en `totales`. */
export const aliasWidget = (widget: DefinicionWidget): string =>
  widget.campo ? `${widget.operacion}_${widget.campo}` : widget.operacion;

/** Filtro del listado más la condición propia del widget. */
export const filtroWidget = (
  filtroListado: Filtro | undefined,
  widget: DefinicionWidget
): Filtro => {
  const base = filtroListado ?? [];
  const extra = widget.filtro ?? [];
  if (extra.length === 0) return base;

  const esListaDeClausulas =
    Array.isArray(base) && (base.length === 0 || Array.isArray(base[0]));
  if (esListaDeClausulas) return [...(base as ClausulaFiltro[]), ...extra];

  return { and: [base, ...extra] } as Filtro;
};

/** Una petición por cada filtro distinto: los widgets que comparten filtro van juntos. */
export const agruparPorFiltro = (
  widgets: DefinicionWidget[]
): DefinicionWidget[][] => {
  const grupos = new Map<string, DefinicionWidget[]>();
  widgets.forEach((widget) => {
    const clave = JSON.stringify(widget.filtro ?? []);
    grupos.set(clave, [...(grupos.get(clave) ?? []), widget]);
  });
  return [...grupos.values()];
};

const pies: Record<OperacionWidget, string> = {
  suma: "Suma",
  conteo: "Recuento",
  promedio: "Media",
  minimo: "Mínimo",
  maximo: "Máximo",
};

export const pieWidget = (
  widget: DefinicionWidget,
  campos: CampoWidget[] = []
): string => {
  if (widget.pie) return widget.pie;
  if (!widget.campo) return pies[widget.operacion];
  const etiqueta =
    campos.find((campo) => campo.id === widget.campo)?.etiqueta ?? widget.campo;
  // En minúscula salvo siglas (IVA, IRPF...)
  const enFrase =
    etiqueta === etiqueta.toUpperCase() ? etiqueta : etiqueta.toLowerCase();
  return `${pies[widget.operacion]} de ${enFrase}`;
};

export const operacionesWidget: {
  valor: OperacionWidget;
  descripcion: string;
}[] = [
  { valor: "suma", descripcion: "Suma" },
  { valor: "promedio", descripcion: "Media" },
  { valor: "conteo", descripcion: "Recuento" },
  { valor: "maximo", descripcion: "Máximo" },
  { valor: "minimo", descripcion: "Mínimo" },
];

export const formatosWidget: { valor: FormatoWidget; descripcion: string }[] = [
  { valor: "moneda", descripcion: "Importe (€)" },
  { valor: "numero", descripcion: "Número" },
];

/** Widget nuevo a partir de lo elegido en el panel de personalización. */
export const nuevoWidget = (
  titulo: string,
  operacion: OperacionWidget,
  campo: CampoWidget | undefined,
  existentes: DefinicionWidget[],
  formato?: FormatoWidget
): DefinicionWidget => {
  const base = `${operacion}_${campo?.id ?? "registros"}`;
  let id = base;
  for (let n = 2; existentes.some((w) => w.id === id); n++) id = `${base}_${n}`;
  return {
    id,
    titulo: titulo.trim(),
    operacion,
    ...(operacion === "conteo" ? {} : { campo: campo?.id }),
    formato:
      operacion === "conteo"
        ? "numero"
        : (formato ?? campo?.formato ?? "numero"),
  };
};

export const MAX_WIDGETS = 8;

/**
 * Recurso agregable del maestro de una pantalla. Varios recursos pueden compartir
 * pantalla (p. ej. las líneas): se prefiere el que se llama como la ruta
 * (`/ventas/factura` → `ventas.factura`) y si no, el primero que no sea de líneas.
 */
export const recursoParaRuta = (
  recursos: RecursoAgregable[],
  ruta: string
): RecursoAgregable | undefined => {
  const candidatos = recursos.filter(
    (r) => ruta === r.ruta || ruta.startsWith(`${r.ruta}/`)
  );
  const homonimo = candidatos.find(
    (r) => r.id === r.ruta.replace(/^\//, "").replace(/\//g, ".")
  );
  return homonimo ?? candidatos.find((r) => !r.id.endsWith(".linea"));
};

/** Heurística por el nombre de la medida: ¿es un importe (se formatea como moneda)? */
export const pareceImporte = (id: string) =>
  /total|neto|importe|saldo|precio|pvp|coste|cobrad|pagad|pendiente/i.test(id);

const enMayuscula = (texto: string) =>
  texto.charAt(0).toUpperCase() + texto.slice(1);

/**
 * Configuración para un maestro que no define widgets propios: sin widgets por
 * defecto (los crea el usuario) y con las medidas que publica el servidor.
 */
export const configDesdeRecurso = (
  recurso: RecursoAgregable
): ConfigWidgets => ({
  recurso: recurso.id,
  // Las descripciones del registro son para el asistente: "Clientes (una fila
  // por cliente) — cuántos hay por…" → "Clientes".
  titulo: enMayuscula(
    recurso.descripcion.split(/\s*[(—]/)[0].replace(/\.$/, "")
  ),
  widgets: [],
  campos: recurso.medidas.map((medida) => ({
    id: medida.id,
    etiqueta: enMayuscula(medida.descripcion),
    formato: pareceImporte(medida.id) ? "moneda" : "numero",
  })),
});

export const formatearValorWidget = (
  valor: number | null | undefined,
  widget: DefinicionWidget
): string => {
  if (valor === null || valor === undefined) return "—";
  if (widget.formato === "moneda") return formatearMoneda(valor, "EUR");
  return valor.toLocaleString("es-ES", { maximumFractionDigits: 2 });
};
