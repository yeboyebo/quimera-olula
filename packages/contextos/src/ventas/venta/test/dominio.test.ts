import {
    DIVISA_EMPRESA,
    enDivisaExtranjera,
    formatearTasaConversion,
    metaLineaVenta,
    mostrarImporte,
    puedeCambiarDivisa,
} from "#/ventas/venta/dominio.ts";
import { modeloEsEditable } from "@olula/lib/dominio.ts";
import { describe, expect, test } from "vitest";

describe("mostrarImporte solo muestra importes distintos de cero", () => {
    test("un importe distinto de cero se muestra", () => {
        expect(mostrarImporte(12.5)).toBe(true);
        expect(mostrarImporte(-3)).toBe(true);
    });

    test("cero, null y undefined no se muestran", () => {
        expect(mostrarImporte(0)).toBe(false);
        expect(mostrarImporte(null)).toBe(false);
        expect(mostrarImporte(undefined)).toBe(false);
    });
});

describe("enDivisaExtranjera decide si hay que convertir a la divisa de la empresa", () => {
    test("una divisa distinta de la de la empresa es extranjera", () => {
        expect(enDivisaExtranjera({ divisa_id: "USD" })).toBe(true);
    });

    test(`${DIVISA_EMPRESA} no es extranjera, en cualquier caja`, () => {
        expect(enDivisaExtranjera({ divisa_id: "EUR" })).toBe(false);
        expect(enDivisaExtranjera({ divisa_id: " eur " })).toBe(false);
    });

    test("una divisa vacía no es extranjera", () => {
        expect(enDivisaExtranjera({ divisa_id: "" })).toBe(false);
    });
});

describe("formatearTasaConversion", () => {
    test("usa formato español con cuatro decimales", () => {
        expect(formatearTasaConversion(1.085)).toBe("×1,0850");
        expect(formatearTasaConversion(1)).toBe("×1,0000");
    });
});

describe("campos fiscales de la línea de venta", () => {
    const editable = modeloEsEditable(metaLineaVenta);
    const linea = {} as Parameters<typeof editable>[0];

    test("dto_lineal, tipo_irpf y por_comision son editables", () => {
        expect(editable(linea, "dto_lineal")).toBe(true);
        expect(editable(linea, "tipo_irpf")).toBe(true);
        expect(editable(linea, "por_comision")).toBe(true);
    });

    test("tipo_recargo e importe_comision son de solo lectura", () => {
        expect(editable(linea, "tipo_recargo")).toBe(false);
        expect(editable(linea, "importe_comision")).toBe(false);
    });
});

describe("puedeCambiarDivisa solo deja tocar la divisa con el documento vacío", () => {
    test("sin ninguna línea se puede cambiar", () => {
        expect(puedeCambiarDivisa({ lineas: [] })).toBe(true);
    });

    test("con una línea ya no", () => {
        expect(puedeCambiarDivisa({ lineas: [{}] })).toBe(false);
    });

    test("un documento cuyas líneas aún no han llegado cuenta como vacío", () => {
        expect(puedeCambiarDivisa({})).toBe(true);
    });
});
