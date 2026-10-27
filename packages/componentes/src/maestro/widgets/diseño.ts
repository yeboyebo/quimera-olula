import { ClausulaFiltro } from "@olula/lib/diseño.ts";

/** Operaciones del motor de agregación del servidor (GET /comun/agregado/<recurso>). */
export type OperacionWidget =
  "suma" | "conteo" | "promedio" | "minimo" | "maximo";

export type FormatoWidget = "moneda" | "numero";

export type DefinicionWidget = {
  id: string;
  titulo: string;
  operacion: OperacionWidget;
  /** Medida del recurso (p. ej. `total`); sin campo solo vale para `conteo`. */
  campo?: string;
  /** Condición extra sobre el filtro del listado (p. ej. solo las pendientes). */
  filtro?: ClausulaFiltro[];
  formato: FormatoWidget;
  /** Texto bajo el valor; por defecto se deriva de la operación. */
  pie?: string;
};

/** Medida del recurso que el usuario puede elegir al personalizar. */
export type CampoWidget = {
  id: string;
  etiqueta: string;
  formato: FormatoWidget;
};

/**
 * Widgets de un maestro: el recurso agregable del servidor, los widgets por
 * defecto y las medidas que se ofrecen al personalizar.
 */
export type ConfigWidgets = {
  recurso: string;
  /** Nombre de la pantalla para el panel de personalización (p. ej. "Facturas"). */
  titulo: string;
  widgets: DefinicionWidget[];
  campos: CampoWidget[];
};

/** Recurso agregable tal como lo publica el servidor (GET /comun/agregado). */
export type RecursoAgregable = {
  id: string;
  descripcion: string;
  /** Pantalla del maestro (p. ej. `/ventas/factura`). */
  ruta: string;
  medidas: { id: string; descripcion: string }[];
};

/** De dónde sale la configuración que ve el usuario. */
export type OrigenWidgets = "usuario" | "empresa" | null;

/** Valor por widget: número, `null` si el servidor no lo puede calcular con ese filtro. */
export type ValoresWidgets = Record<string, number | null>;
