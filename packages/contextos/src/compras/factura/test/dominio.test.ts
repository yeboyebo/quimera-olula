import { facturaVacia } from "#/compras/factura/detalle/detalle.ts";
import { EstadoExpedicion, Factura } from "#/compras/factura/diseño.ts";
import {
    estadoExpedicionDesdeApi,
    facturaReabrible,
    facturaRegistrable,
} from "#/compras/factura/dominio.ts";
import { describe, expect, test } from "vitest";

const conEstado = (estadoExpedicion: EstadoExpedicion): Factura => ({
    ...facturaVacia(),
    estadoExpedicion,
});

const conAsiento = (asientoId: string | null): Factura => ({
    ...facturaVacia(),
    asientoId,
});

describe("registrar saca la factura de borrador", () => {
    test("se ofrece en BORRADOR", () => {
        expect(facturaRegistrable(conEstado("BORRADOR"))).toBe(true);
    });

    test("no se ofrece en lo que ya está registrado", () => {
        expect(facturaRegistrable(conEstado("REGISTRADA"))).toBe(false);
    });

    test("no se ofrece sin estado, que es la factura sin cargar", () => {
        expect(facturaRegistrable(facturaVacia())).toBe(false);
    });
});

describe("reabrir solo aplica a la factura que bloqueó la contabilidad", () => {
    test("se ofrece cuando hay asiento", () => {
        expect(facturaReabrible(conAsiento("123"))).toBe(true);
    });

    test("no se ofrece sin asiento", () => {
        expect(facturaReabrible(conAsiento(null))).toBe(false);
    });

    test("no depende del estado de expedición", () => {
        expect(facturaReabrible({ ...conEstado("BORRADOR"), asientoId: "7" }))
            .toBe(true);
    });
});

describe("estados de expedición que llegan del servidor", () => {
    test("se normalizan a los códigos del dominio", () => {
        expect(estadoExpedicionDesdeApi("BORRADOR")).toBe("BORRADOR");
        expect(estadoExpedicionDesdeApi("REGISTRADA")).toBe("REGISTRADA");
    });

    test("se aceptan con otra caja o con espacios", () => {
        expect(estadoExpedicionDesdeApi("Borrador")).toBe("BORRADOR");
        expect(estadoExpedicionDesdeApi(" registrada ")).toBe("REGISTRADA");
    });

    test("lo que no se reconoce se queda sin estado", () => {
        expect(estadoExpedicionDesdeApi("")).toBe("");
        expect(estadoExpedicionDesdeApi(null)).toBe("");
        expect(estadoExpedicionDesdeApi(undefined)).toBe("");
        expect(estadoExpedicionDesdeApi("EMITIDA")).toBe("");
    });
});
