import { facturaVacia } from "#/ventas/factura/dominio.ts";
import { editable, metaFactura } from "#/ventas/factura/detalle/diseño.ts";
import { Factura } from "#/ventas/factura/diseño.ts";
import { modeloEsEditable } from "@olula/lib/dominio.ts";
import { describe, expect, test } from "vitest";

const abierta = (): Factura => ({ ...facturaVacia(), editable: true });

describe("es el servidor quien decide si una factura se edita", () => {
    test("con la marca puesta se edita", () => {
        expect(editable(abierta())).toBe(true);
    });

    test("con la marca quitada no", () => {
        expect(editable({ ...facturaVacia(), editable: false })).toBe(false);
    });

    test("sin marca ninguna se considera cerrada", () => {
        const sinMarca = { ...facturaVacia(), editable: undefined };
        expect(editable(sinMarca)).toBe(false);
    });
});

describe("campos que no se tocan a mano ni en una factura abierta", () => {
    const campoEditable = modeloEsEditable(metaFactura);

    test("divisa, tasa, agente y comisión solo cambian por su modal", () => {
        expect(campoEditable(abierta(), "divisa_id")).toBe(false);
        expect(campoEditable(abierta(), "tasa_conversion")).toBe(false);
        expect(campoEditable(abierta(), "agente_id")).toBe(false);
        expect(campoEditable(abierta(), "por_comision")).toBe(false);
    });

    test("fecha, hora y las marcas de automática y servicios sí se editan", () => {
        expect(campoEditable(abierta(), "fecha")).toBe(true);
        expect(campoEditable(abierta(), "hora")).toBe(true);
        expect(campoEditable(abierta(), "automatica")).toBe(true);
        expect(campoEditable(abierta(), "servicios")).toBe(true);
    });

    test("una factura cerrada bloquea todo", () => {
        const cerrada = facturaVacia();
        expect(campoEditable(cerrada, "fecha")).toBe(false);
        expect(campoEditable(cerrada, "hora")).toBe(false);
        expect(campoEditable(cerrada, "automatica")).toBe(false);
    });
});
