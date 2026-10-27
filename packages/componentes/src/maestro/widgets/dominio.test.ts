import { DefinicionWidget } from "./diseño.ts";
import {
  agruparPorFiltro,
  configDesdeRecurso,
  recursoParaRuta,
  aliasWidget,
  filtroWidget,
  formatearValorWidget,
  metricaWidget,
  nuevoWidget,
  pieWidget,
} from "./dominio.ts";

const total: DefinicionWidget = {
  id: "total",
  titulo: "Total",
  operacion: "suma",
  campo: "total",
  formato: "moneda",
};
const recuento: DefinicionWidget = {
  id: "n",
  titulo: "Facturas",
  operacion: "conteo",
  formato: "numero",
};
const pendientes: DefinicionWidget = {
  ...recuento,
  id: "pendientes",
  filtro: [["estado", "=", "pendiente"]],
};

describe("widgets del maestro", () => {
  test("métrica y alias coinciden con el servidor", () => {
    expect(metricaWidget(total)).toBe("suma:total");
    expect(aliasWidget(total)).toBe("suma_total");
    expect(metricaWidget(recuento)).toBe("conteo");
    expect(aliasWidget(recuento)).toBe("conteo");
  });

  test("el filtro del widget se suma al del listado", () => {
    expect(filtroWidget([["fecha", ">=", "2026-01-01"]], pendientes)).toEqual([
      ["fecha", ">=", "2026-01-01"],
      ["estado", "=", "pendiente"],
    ]);
    expect(filtroWidget(undefined, total)).toEqual([]);
    expect(filtroWidget({ or: [] }, pendientes)).toEqual({
      and: [{ or: [] }, ["estado", "=", "pendiente"]],
    });
  });

  test("una petición por filtro distinto", () => {
    expect(agruparPorFiltro([total, recuento, pendientes])).toEqual([
      [total, recuento],
      [pendientes],
    ]);
  });

  test("formato y pie", () => {
    expect(formatearValorWidget(null, total)).toBe("—");
    expect(formatearValorWidget(1234.5, recuento)).toBe("1234,5");
    expect(pieWidget(total)).toBe("Suma de total");
    expect(pieWidget({ ...total, pie: "Suma del total" })).toBe(
      "Suma del total"
    );
  });

  test("el pie usa la etiqueta del campo", () => {
    expect(
      pieWidget(total, [
        { id: "total", etiqueta: "Base imponible", formato: "moneda" },
      ])
    ).toBe("Suma de base imponible");
    expect(
      pieWidget({ ...total, campo: "total_iva" }, [
        { id: "total_iva", etiqueta: "IVA", formato: "moneda" },
      ])
    ).toBe("Suma de IVA");
  });

  test("nuevo widget: id único y formato del campo", () => {
    const neto = { id: "neto", etiqueta: "Base", formato: "moneda" as const };
    const primero = nuevoWidget(" Base ", "suma", neto, []);
    expect(primero).toEqual({
      id: "suma_neto",
      titulo: "Base",
      operacion: "suma",
      campo: "neto",
      formato: "moneda",
    });
    expect(nuevoWidget("Otra", "suma", neto, [primero]).id).toBe("suma_neto_2");
    expect(nuevoWidget("N", "conteo", neto, [])).toEqual({
      id: "conteo_neto",
      titulo: "N",
      operacion: "conteo",
      formato: "numero",
    });
  });

  test("recurso de la pantalla: el homónimo de la ruta, nunca el de líneas", () => {
    const recursos = [
      {
        id: "ventas.factura.linea",
        descripcion: "",
        ruta: "/ventas/factura",
        medidas: [],
      },
      {
        id: "tesoreria.pago_cobro",
        descripcion: "",
        ruta: "/ventas/factura",
        medidas: [],
      },
      {
        id: "ventas.factura",
        descripcion: "",
        ruta: "/ventas/factura",
        medidas: [],
      },
      {
        id: "crm.oportunidad_venta",
        descripcion: "",
        ruta: "/crm/oportunidadventa",
        medidas: [],
      },
    ];
    expect(recursoParaRuta(recursos, "/ventas/factura")?.id).toBe(
      "ventas.factura"
    );
    expect(recursoParaRuta(recursos, "/ventas/factura/123")?.id).toBe(
      "ventas.factura"
    );
    expect(recursoParaRuta(recursos, "/crm/oportunidadventa")?.id).toBe(
      "crm.oportunidad_venta"
    );
    expect(recursoParaRuta(recursos, "/ventas/facturacion")).toBeUndefined();
    expect(recursoParaRuta(recursos, "/crm/cliente")).toBeUndefined();
  });

  test("configuración automática: sin widgets y con las medidas del servidor", () => {
    const config = configDesdeRecurso({
      id: "almacen.stock",
      descripcion: "Stock por artículo y almacén (una fila por stock).",
      ruta: "/almacen/stock",
      medidas: [
        { id: "cantidad", descripcion: "unidades en stock" },
        { id: "importe_total", descripcion: "valor del stock" },
      ],
    });
    expect(config).toEqual({
      recurso: "almacen.stock",
      titulo: "Stock por artículo y almacén",
      widgets: [],
      campos: [
        { id: "cantidad", etiqueta: "Unidades en stock", formato: "numero" },
        { id: "importe_total", etiqueta: "Valor del stock", formato: "moneda" },
      ],
    });
  });
});
