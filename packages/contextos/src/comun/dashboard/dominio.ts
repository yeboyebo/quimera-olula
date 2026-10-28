import { pareceImporte } from "@olula/componentes/maestro/widgets/dominio.ts";
import { posicionLibre } from "@olula/componentes/rejilla/dominio.ts";
import { formatearMoneda } from "@olula/lib/dominio.ts";
import {
  ComponenteDashboard,
  ConsultaComponente,
  Dashboard,
  DefinicionTipoComponente,
  FormatoValor,
  Granularidad,
  GrupoAgregado,
  RangoPeriodo,
  RespuestaAgregado,
  TipoComponente,
} from "./diseño.ts";

export const MAX_COMPONENTES = 40;

export const CATALOGO: DefinicionTipoComponente[] = [
  { tipo: "tarjeta", nombre: "Tarjeta", descripcion: "Un valor y su comparación con otro periodo", grupo: "Indicadores", w: 3, h: 2, disponible: true },
  { tipo: "objetivo", nombre: "Objetivo", descripcion: "Valor frente a una meta", grupo: "Indicadores", w: 3, h: 2, disponible: true },
  { tipo: "temporal", nombre: "Temporal", descripcion: "Evolución por día, mes o año", grupo: "Gráficos", w: 8, h: 4, disponible: true },
  { tipo: "barras", nombre: "Barras", descripcion: "Comparar categorías", grupo: "Gráficos", w: 6, h: 4, disponible: true },
  { tipo: "circular", nombre: "Circular", descripcion: "Reparto entre pocas categorías", grupo: "Gráficos", w: 4, h: 4, disponible: true },
  { tipo: "embudo", nombre: "Embudo", descripcion: "Presupuesto → pedido → factura", grupo: "Gráficos", w: 4, h: 4, disponible: false },
  { tipo: "mapa", nombre: "Mapa", descripcion: "Por comunidad o provincia", grupo: "Gráficos", w: 6, h: 5, disponible: false },
  { tipo: "ranking", nombre: "Ranking", descripcion: "Los primeros N: clientes, artículos…", grupo: "Datos", w: 6, h: 4, disponible: true },
  { tipo: "tabla", nombre: "Tabla filtrada", descripcion: "Filas de un listado con su filtro", grupo: "Datos", w: 12, h: 4, disponible: true },
  { tipo: "tabla_resumen", nombre: "Tabla resumen", descripcion: "Cruce de dos dimensiones", grupo: "Datos", w: 6, h: 4, disponible: false },
  { tipo: "avisos", nombre: "Avisos", descripcion: "Umbrales que piden atención", grupo: "Otros", w: 6, h: 3, disponible: false },
  { tipo: "pregunta_ia", nombre: "Pregunta a la IA", descripcion: "Describe lo que quieres ver", grupo: "Otros", w: 6, h: 4, disponible: false },
  { tipo: "accesos", nombre: "Accesos rápidos", descripcion: "Enlaces a pantallas", grupo: "Otros", w: 6, h: 2, disponible: false },
  { tipo: "texto", nombre: "Texto", descripcion: "Una nota libre", grupo: "Otros", w: 4, h: 2, disponible: true },
];

export const definicionTipo = (tipo: TipoComponente): DefinicionTipoComponente =>
  CATALOGO.find((d) => d.tipo === tipo) as DefinicionTipoComponente;

/** Los que no consultan datos (sin consultas ni permisos). */
export const sinDatos = (tipo: TipoComponente) => tipo === "texto" || tipo === "accesos";

// ---------------------------------------------------------------------------
// Consultas
// ---------------------------------------------------------------------------

/** Query string de GET /comun/agregado/<recurso> para una consulta guardada. */
export const queryConsulta = (consulta: ConsultaComponente): string => {
  const parametros = new URLSearchParams();
  const { recurso: _recurso, filtros, limite, ...resto } = consulta;
  Object.entries(resto).forEach(([clave, valor]) => {
    if (valor !== undefined && valor !== null && valor !== "") {
      parametros.set(clave, String(valor));
    }
  });
  if (limite !== undefined) parametros.set("limite", String(limite));
  if (filtros && filtros.length > 0) parametros.set("filtros", JSON.stringify(filtros));
  const query = parametros.toString();
  return query ? `?${query}` : "";
};

/** `suma:total,conteo` → [`suma_total`, `conteo`]: claves de la respuesta. */
export const aliasMetricas = (metricas: string | undefined): string[] =>
  (metricas ?? "")
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean)
    .map((m) => m.replace(":", "_"));

export const campoMetrica = (metrica: string | undefined): string | undefined =>
  (metrica ?? "").split(",")[0]?.split(":")[1] || undefined;

/** `fecha:mes` → ["fecha", "mes"]; `cliente` → ["cliente", undefined]. */
export const leerAgrupacion = (
  agrupar: string | undefined
): [string | undefined, Granularidad | undefined] => {
  const [dimension, granularidad] = (agrupar ?? "").split(",")[0].split(":");
  return [dimension || undefined, (granularidad as Granularidad) || undefined];
};

export const leerPeriodo = (
  periodo: string | undefined
): [string | undefined, RangoPeriodo | undefined] => {
  const [dimension, rango] = (periodo ?? "").split(":");
  return [dimension || undefined, (rango as RangoPeriodo) || undefined];
};

/** Formato por defecto: importe si la métrica suma/media un campo que lo parece. */
export const formatoPorDefecto = (metricas: string | undefined): FormatoValor => {
  const campo = campoMetrica(metricas);
  const operacion = (metricas ?? "").split(":")[0];
  return campo && operacion !== "conteo_distinto" && pareceImporte(campo)
    ? "moneda"
    : "numero";
};

// ---------------------------------------------------------------------------
// Valores
// ---------------------------------------------------------------------------

export const formatearValor = (
  valor: number | null | undefined,
  formato: FormatoValor = "numero"
): string => {
  if (valor === null || valor === undefined || Number.isNaN(valor)) return "—";
  if (formato === "moneda") return formatearMoneda(valor, "EUR");
  return valor.toLocaleString("es-ES", { maximumFractionDigits: 2 });
};

/** Valor abreviado para ejes: 184.320 → «184k». */
export const formatearCorto = (valor: number): string => {
  const absoluto = Math.abs(valor);
  if (absoluto >= 1_000_000) return `${(valor / 1_000_000).toLocaleString("es-ES", { maximumFractionDigits: 1 })}M`;
  if (absoluto >= 1_000) return `${(valor / 1_000).toLocaleString("es-ES", { maximumFractionDigits: 0 })}k`;
  return valor.toLocaleString("es-ES", { maximumFractionDigits: 1 });
};

export type Variacion = { texto: string; positiva: boolean };

/** Variación porcentual frente al otro periodo; null si no se puede calcular. */
export const variacion = (
  actual: number | null | undefined,
  anterior: number | null | undefined
): Variacion | null => {
  if (actual == null || anterior == null || anterior === 0) return null;
  const porcentaje = ((actual - anterior) / Math.abs(anterior)) * 100;
  const signo = porcentaje > 0 ? "+" : "";
  return {
    texto: `${signo}${porcentaje.toLocaleString("es-ES", { maximumFractionDigits: 1 })} %`,
    positiva: porcentaje >= 0,
  };
};

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

/** Etiqueta del eje para el inicio de un tramo (`2026-10-01`, mes → «oct 26»). */
export const etiquetaTramo = (iso: string, granularidad: Granularidad | undefined): string => {
  const [año, mes, dia] = iso.split("-").map(Number);
  if (!año || !mes) return iso;
  const añoCorto = String(año).slice(2);
  switch (granularidad) {
    case "año":
      return String(año);
    case "trimestre":
      return `T${Math.floor((mes - 1) / 3) + 1} ${añoCorto}`;
    case "mes":
      return `${MESES[mes - 1]} ${añoCorto}`;
    default:
      return `${dia} ${MESES[mes - 1]}`;
  }
};

export type PuntoSerie = { etiqueta: string; actual: number | null; anterior: number | null };

/**
 * Serie temporal con su comparación alineada por posición (el servidor devuelve un
 * tramo por cada día/mes… del periodo, también los vacíos, en los dos periodos).
 */
export const serieTemporal = (
  respuesta: RespuestaAgregado,
  consulta: ConsultaComponente
): PuntoSerie[] => {
  const [dimension, granularidad] = leerAgrupacion(consulta.agrupar);
  const [alias] = aliasMetricas(consulta.metricas);
  if (!dimension || !alias) return [];
  const anteriores = respuesta.comparacion?.grupos ?? [];
  return respuesta.grupos.map((grupo, i) => ({
    etiqueta: etiquetaTramo(String(grupo[dimension]), granularidad),
    actual: numero(grupo[alias]),
    anterior: anteriores[i] ? numero(anteriores[i][alias]) : null,
  }));
};

export type Categoria = { clave: string; etiqueta: string; valor: number };

/** Grupos de una dimensión con su nombre (`cliente_nombre`) si el servidor lo da. */
export const categorias = (
  respuesta: RespuestaAgregado,
  consulta: ConsultaComponente
): Categoria[] => {
  const [dimension] = leerAgrupacion(consulta.agrupar);
  const [alias] = aliasMetricas(consulta.metricas);
  if (!dimension || !alias) return [];
  return respuesta.grupos.map((grupo) => {
    const clave = grupo[dimension];
    const nombre = grupo[`${dimension}_nombre`];
    return {
      clave: String(clave ?? ""),
      etiqueta: textoCategoria(clave, nombre),
      valor: numero(grupo[alias]) ?? 0,
    };
  });
};

const textoCategoria = (clave: GrupoAgregado[string], nombre: GrupoAgregado[string]) => {
  if (clave === null || clave === undefined || clave === "") return "Sin valor";
  if (clave === true) return "Sí";
  if (clave === false) return "No";
  return nombre ? String(nombre) : String(clave);
};

const numero = (valor: unknown): number | null =>
  typeof valor === "number" ? valor : valor == null ? null : Number(valor);

/** Circular legible: las N mayores y el resto sumado en «Otros». */
export const agruparResto = (lista: Categoria[], maximo = 6): Categoria[] => {
  if (lista.length <= maximo) return lista;
  const ordenadas = [...lista].sort((a, b) => b.valor - a.valor);
  const resto = ordenadas.slice(maximo - 1).reduce((suma, c) => suma + c.valor, 0);
  return [...ordenadas.slice(0, maximo - 1), { clave: "__otros", etiqueta: "Otros", valor: resto }];
};

// ---------------------------------------------------------------------------
// Componentes
// ---------------------------------------------------------------------------

/** Consulta con la que arranca el editor para un tipo y un recurso. */
export const consultaPorDefecto = (
  tipo: TipoComponente,
  recurso: string,
  medida: string | undefined,
  dimensionFecha: string | undefined
): ConsultaComponente => {
  const metricas = medida ? `suma:${medida}` : "conteo";
  const periodo = dimensionFecha ? `${dimensionFecha}:este_año` : undefined;
  switch (tipo) {
    case "tarjeta":
    case "objetivo":
      return {
        recurso,
        metricas,
        periodo: dimensionFecha ? `${dimensionFecha}:este_mes` : undefined,
        comparar: tipo === "tarjeta" && dimensionFecha ? "año_anterior" : undefined,
      };
    case "temporal":
      return {
        recurso,
        metricas,
        agrupar: dimensionFecha ? `${dimensionFecha}:mes` : undefined,
        periodo: dimensionFecha ? `${dimensionFecha}:ultimos_12_meses` : undefined,
        comparar: dimensionFecha ? "año_anterior" : undefined,
        limite: 100,
      };
    case "tabla":
      return { recurso, columnas: "", limite: 10 };
    default:
      return { recurso, metricas, periodo, limite: tipo === "circular" ? 20 : 10 };
  }
};

export const nuevoComponente = (
  tipo: TipoComponente,
  existentes: ComponenteDashboard[]
): ComponenteDashboard => {
  const { w, h, nombre } = definicionTipo(tipo);
  const ids = new Set(existentes.map((c) => c.id));
  let n = existentes.length + 1;
  while (ids.has(`c${n}`)) n++;
  return {
    id: `c${n}`,
    tipo,
    titulo: tipo === "texto" ? "" : nombre,
    ...posicionLibre(existentes, w, h),
    w,
    h,
    consultas: [],
    opciones: tipo === "texto" ? { texto: "" } : {},
  };
};

/** ¿Se puede guardar? Un componente con datos necesita qué medir y, si lo pide, por qué agrupar. */
export const problemaComponente = (componente: ComponenteDashboard): string | null => {
  if (sinDatos(componente.tipo)) return null;
  const [consulta] = componente.consultas;
  if (!consulta?.recurso) return "Elige de dónde salen los datos";
  if (componente.tipo === "tabla") {
    return consulta.columnas ? null : "Elige al menos una columna";
  }
  if (!consulta.metricas) return "Elige qué medir";
  const agrupa = ["temporal", "barras", "circular", "ranking"].includes(componente.tipo);
  if (agrupa && !consulta.agrupar) return "Elige por qué agrupar";
  if (componente.tipo === "objetivo" && !componente.opciones.meta) return "Indica la meta";
  return null;
};

export const sustituirComponente = (
  componentes: ComponenteDashboard[],
  componente: ComponenteDashboard
): ComponenteDashboard[] =>
  componentes.some((c) => c.id === componente.id)
    ? componentes.map((c) => (c.id === componente.id ? componente : c))
    : [...componentes, componente];

export const RANGOS_PERIODO: { valor: RangoPeriodo; descripcion: string }[] = [
  { valor: "hoy", descripcion: "Hoy" },
  { valor: "ayer", descripcion: "Ayer" },
  { valor: "esta_semana", descripcion: "Esta semana" },
  { valor: "semana_anterior", descripcion: "Semana anterior" },
  { valor: "este_mes", descripcion: "Este mes" },
  { valor: "mes_anterior", descripcion: "Mes anterior" },
  { valor: "este_trimestre", descripcion: "Este trimestre" },
  { valor: "trimestre_anterior", descripcion: "Trimestre anterior" },
  { valor: "este_año", descripcion: "Este año" },
  { valor: "año_anterior", descripcion: "Año anterior" },
  { valor: "ultimos_7_dias", descripcion: "Últimos 7 días" },
  { valor: "ultimos_30_dias", descripcion: "Últimos 30 días" },
  { valor: "ultimos_90_dias", descripcion: "Últimos 90 días" },
  { valor: "ultimos_12_meses", descripcion: "Últimos 12 meses" },
];

export const GRANULARIDADES: { valor: Granularidad; descripcion: string }[] = [
  { valor: "dia", descripcion: "Día" },
  { valor: "semana", descripcion: "Semana" },
  { valor: "mes", descripcion: "Mes" },
  { valor: "trimestre", descripcion: "Trimestre" },
  { valor: "año", descripcion: "Año" },
];

export const OPERACIONES: { valor: string; descripcion: string; conCampo: boolean }[] = [
  { valor: "suma", descripcion: "Suma de", conCampo: true },
  { valor: "conteo", descripcion: "Número de registros", conCampo: false },
  { valor: "promedio", descripcion: "Media de", conCampo: true },
  { valor: "maximo", descripcion: "Máximo de", conCampo: true },
  { valor: "minimo", descripcion: "Mínimo de", conCampo: true },
];

/**
 * Los que el usuario puede ver: todos los recursos de sus consultas están entre los
 * que le permite el servidor (lo mismo que hace el servidor con los guardados).
 */
export const componentesVisibles = (
  componentes: ComponenteDashboard[],
  recursosPermitidos: string[]
): ComponenteDashboard[] =>
  componentes.filter((c) => c.consultas.every((q) => recursosPermitidos.includes(q.recurso)));

/** Dashboard de módulo aún sin versión del usuario: el de código, sin id. */
export const dashboardPorDefecto = (
  clave: string,
  definicion: { nombre: string; componentes: ComponenteDashboard[] },
  recursosPermitidos: string[]
): Dashboard => ({
  id: "",
  nombre: definicion.nombre,
  clave,
  compartido: false,
  propietario: "",
  esPropio: true,
  actualizadoEn: "",
  componentes: componentesVisibles(definicion.componentes, recursosPermitidos),
  componentesOcultos: 0,
});
