import { ComponenteDashboard, RespuestaAgregado } from "./diseño.ts";
import {
  agruparResto,
  aliasMetricas,
  categorias,
  consultaPorDefecto,
  etiquetaTramo,
  formatoPorDefecto,
  nuevoComponente,
  problemaComponente,
  queryConsulta,
  serieTemporal,
  sustituirComponente,
  variacion,
} from "./dominio.ts";

const respuesta = (cambios: Partial<RespuestaAgregado>): RespuestaAgregado => ({
  recurso: "ventas.factura",
  grupos: [],
  total_grupos: 0,
  truncado: false,
  totales: {},
  ...cambios,
});

const componente = (cambios: Partial<ComponenteDashboard>): ComponenteDashboard => ({
  id: "c1",
  tipo: "tarjeta",
  titulo: "Facturado",
  x: 0,
  y: 0,
  w: 3,
  h: 2,
  consultas: [{ recurso: "ventas.factura", metricas: "suma:total" }],
  opciones: {},
  ...cambios,
});

describe("dashboard: consultas", () => {
  test("query string con los parámetros de la REST", () => {
    const query = queryConsulta({
      recurso: "ventas.factura",
      metricas: "suma:total",
      agrupar: "fecha:mes",
      periodo: "fecha:ultimos_12_meses",
      comparar: "año_anterior",
      limite: 24,
      filtros: [{ campo: "agente", operador: "=", valor: "A1" }],
    });
    const parametros = new URLSearchParams(query.slice(1));
    expect(parametros.get("metricas")).toBe("suma:total");
    expect(parametros.get("comparar")).toBe("año_anterior");
    expect(parametros.get("limite")).toBe("24");
    expect(parametros.has("recurso")).toBe(false);
    expect(JSON.parse(parametros.get("filtros") ?? "")).toEqual([
      { campo: "agente", operador: "=", valor: "A1" },
    ]);
  });

  test("alias de las métricas en la respuesta", () => {
    expect(aliasMetricas("suma:total, conteo")).toEqual(["suma_total", "conteo"]);
    expect(aliasMetricas(undefined)).toEqual([]);
  });

  test("formato por defecto según la medida", () => {
    expect(formatoPorDefecto("suma:total")).toBe("moneda");
    expect(formatoPorDefecto("conteo")).toBe("numero");
    expect(formatoPorDefecto("suma:cantidad")).toBe("numero");
  });

  test("consulta por defecto de cada tipo", () => {
    expect(consultaPorDefecto("tarjeta", "ventas.factura", "total", "fecha")).toEqual({
      recurso: "ventas.factura",
      metricas: "suma:total",
      periodo: "fecha:este_mes",
      comparar: "año_anterior",
    });
    expect(consultaPorDefecto("temporal", "ventas.factura", "total", "fecha").agrupar).toBe(
      "fecha:mes"
    );
    expect(consultaPorDefecto("tarjeta", "compras.proveedor", undefined, undefined)).toEqual({
      recurso: "compras.proveedor",
      metricas: "conteo",
      periodo: undefined,
      comparar: undefined,
    });
  });
});

describe("dashboard: valores", () => {
  test("variación frente al otro periodo", () => {
    expect(variacion(112, 100)).toEqual({ texto: "+12 %", positiva: true });
    expect(variacion(50, 200)).toEqual({ texto: "-75 %", positiva: false });
    expect(variacion(10, 0)).toBeNull();
    expect(variacion(null, 3)).toBeNull();
  });

  test("etiquetas de tramo por granularidad", () => {
    expect(etiquetaTramo("2026-10-01", "mes")).toBe("oct 26");
    expect(etiquetaTramo("2026-07-01", "trimestre")).toBe("T3 26");
    expect(etiquetaTramo("2026-01-01", "año")).toBe("2026");
    expect(etiquetaTramo("2026-10-26", "semana")).toBe("26 oct");
  });

  test("serie temporal alineada con la comparación por posición", () => {
    const serie = serieTemporal(
      respuesta({
        grupos: [
          { fecha: "2026-09-01", suma_total: 10 },
          { fecha: "2026-10-01", suma_total: 0 },
        ],
        comparacion: respuesta({
          grupos: [
            { fecha: "2025-09-01", suma_total: 8 },
            { fecha: "2025-10-01", suma_total: 5 },
          ],
        }),
      }),
      { recurso: "ventas.factura", metricas: "suma:total", agrupar: "fecha:mes" }
    );
    expect(serie).toEqual([
      { etiqueta: "sep 26", actual: 10, anterior: 8 },
      { etiqueta: "oct 26", actual: 0, anterior: 5 },
    ]);
  });

  test("categorías con el nombre que da el servidor", () => {
    const lista = categorias(
      respuesta({
        grupos: [
          { cliente: "C1", cliente_nombre: "Cliente Uno", suma_total: 30 },
          { cliente: null, suma_total: 5 },
          { de_abono: true, suma_total: 1 },
        ],
      }),
      { recurso: "ventas.factura", metricas: "suma:total", agrupar: "cliente" }
    );
    expect(lista.map((c) => c.etiqueta)).toEqual(["Cliente Uno", "Sin valor", "Sin valor"]);
  });

  test("circular: las mayores y el resto en «Otros»", () => {
    const lista = [1, 9, 3, 7, 5, 2, 8].map((valor, i) => ({
      clave: `k${i}`,
      etiqueta: `E${i}`,
      valor,
    }));
    const agrupadas = agruparResto(lista, 4);
    expect(agrupadas.map((c) => c.valor)).toEqual([9, 8, 7, 11]);
    expect(agrupadas[3].etiqueta).toBe("Otros");
  });
});

describe("dashboard: componentes", () => {
  test("nuevo componente: id libre y primer hueco de la rejilla", () => {
    const existentes = [componente({ id: "c1", x: 0, y: 0, w: 8, h: 2 })];
    const nuevo = nuevoComponente("tarjeta", existentes);
    expect(nuevo).toMatchObject({ id: "c2", x: 8, y: 0, w: 3, h: 2, consultas: [] });
  });

  test("qué le falta a un componente para guardarse", () => {
    expect(problemaComponente(componente({}))).toBeNull();
    expect(problemaComponente(componente({ consultas: [] }))).toMatch(/de dónde/);
    expect(problemaComponente(componente({ tipo: "barras" }))).toMatch(/agrupar/);
    expect(
      problemaComponente(
        componente({ tipo: "tabla", consultas: [{ recurso: "ventas.factura", columnas: "" }] })
      )
    ).toMatch(/columna/);
    expect(problemaComponente(componente({ tipo: "objetivo" }))).toMatch(/meta/);
    expect(problemaComponente(componente({ tipo: "texto", consultas: [] }))).toBeNull();
  });

  test("sustituir un componente o añadirlo al final", () => {
    const lista = [componente({ id: "a" }), componente({ id: "b" })];
    expect(
      sustituirComponente(lista, componente({ id: "b", titulo: "Nuevo" })).map((c) => c.titulo)
    ).toEqual(["Facturado", "Nuevo"]);
    expect(sustituirComponente(lista, componente({ id: "c" }))).toHaveLength(3);
  });
});
