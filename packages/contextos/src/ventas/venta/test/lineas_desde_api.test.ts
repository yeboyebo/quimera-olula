import { lineaAlbaranFromAPI } from "#/ventas/albaran/infraestructura.ts";
import { lineaFacturaFromAPI } from "#/ventas/factura/infraestructura.ts";
import { ventasPedidoInfra } from "#/ventas/pedido/infraestructura.ts";
import { lineaPresupuestoFromAPI } from "#/ventas/presupuesto/infraestructura.ts";
import type { LineaVenta } from "#/ventas/venta/diseño.ts";
import { describe, expect, test } from "vitest";

const lineaApi: LineaVenta = {
    id: "linea-1",
    referencia: "ART-001",
    descripcion: "Artículo 001",
    cantidad: 2,
    pvp_unitario: 100,
    dto_porcentual: 10,
    dto_lineal: 12.5,
    pvp_total: 177.5,
    iva_incluido: false,
    grupo_iva_producto_id: "GENERAL",
    tipo_irpf: 15,
    tipo_recargo: 5.2,
    por_comision: 3.5,
    importe_comision: 24.85,
};

const casos: [string, LineaVenta][] = [
    ["presupuesto", lineaPresupuestoFromAPI(lineaApi)],
    ["pedido", ventasPedidoInfra.linea_desde_api(lineaApi)],
    ["albarán", lineaAlbaranFromAPI(lineaApi)],
    ["factura", lineaFacturaFromAPI(lineaApi)],
];

describe.each(casos)("los campos fiscales llegan al dominio (%s)", (_, linea) => {
    test("descuento lineal", () => {
        expect(linea.dto_lineal).toBe(12.5);
    });

    test("tipo de IRPF", () => {
        expect(linea.tipo_irpf).toBe(15);
    });

    test("tipo de recargo de equivalencia", () => {
        expect(linea.tipo_recargo).toBe(5.2);
    });

    test("porcentaje e importe de comisión", () => {
        expect(linea.por_comision).toBe(3.5);
        expect(linea.importe_comision).toBe(24.85);
    });
});
