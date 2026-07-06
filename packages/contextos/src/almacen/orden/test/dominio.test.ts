import { describe, test, expect } from "vitest";
import { validacionCampoModelo } from "@olula/lib/dominio.js";
import {
    ordenVacia,
    lineaOrdenVacia,
    metaNuevaLinea,
    ERR_SKU_REQUERIDO,
    ERR_CANTIDAD_PREVISTA_REQUERIDA,
} from "#/almacen/orden/dominio.ts";

// ---------------------------------------------------------------------------
// [orden-dominio-01] ordenVacia retorna una orden con los campos por defecto
// ---------------------------------------------------------------------------

describe("[orden-dominio-01] ordenVacia retorna una orden con los campos por defecto correctos", () => {
    test("tiene id vacío", () => {
        expect(ordenVacia().id).toBe("");
    });

    test("tiene fecha no nula (fecha actual)", () => {
        expect(typeof ordenVacia().fecha).toBe("string");
        expect(ordenVacia().fecha.length).toBeGreaterThan(0);
    });

    test("tiene tipo ENTRADA por defecto", () => {
        expect(ordenVacia().tipo).toBe("ENTRADA");
    });

    test("tiene almacen_id vacío", () => {
        expect(ordenVacia().almacenId).toBe("");
    });

    test("tiene abierta en true por defecto", () => {
        expect(ordenVacia().abierta).toBe(true);
    });

    test("tiene ubicacion_origen_id en null", () => {
        expect(ordenVacia().ubicacionOrigenId).toBeNull();
    });

    test("tiene caja_origen_id en null", () => {
        expect(ordenVacia().cajaOrigenId).toBeNull();
    });

    test("tiene ubicacion_destino_id en null", () => {
        expect(ordenVacia().ubicacionDestinoId).toBeNull();
    });

    test("tiene caja_destino_id en null", () => {
        expect(ordenVacia().cajaDestinoId).toBeNull();
    });

    test("tiene lineas como array vacío", () => {
        expect(ordenVacia().lineas).toEqual([]);
    });
});

// ---------------------------------------------------------------------------
// [orden-dominio-02] lineaOrdenVacia retorna una línea con los campos por defecto
// ---------------------------------------------------------------------------

describe("[orden-dominio-02] lineaOrdenVacia retorna una línea con los campos por defecto correctos", () => {
    test("tiene sku vacío", () => {
        expect(lineaOrdenVacia().sku).toBe("");
    });

    test("tiene lote_id en null", () => {
        expect(lineaOrdenVacia().loteId).toBeNull();
    });

    test("tiene cantidad_prevista en 0", () => {
        expect(lineaOrdenVacia().cantidadPrevista).toBe(0);
    });

    test("tiene ubicacion_origen_id en null", () => {
        expect(lineaOrdenVacia().ubicacionOrigenId).toBeNull();
    });

    test("tiene caja_origen_id en null", () => {
        expect(lineaOrdenVacia().cajaOrigenId).toBeNull();
    });

    test("tiene ubicacion_destino_id en null", () => {
        expect(lineaOrdenVacia().ubicacionDestinoId).toBeNull();
    });

    test("tiene caja_destino_id en null", () => {
        expect(lineaOrdenVacia().cajaDestinoId).toBeNull();
    });
});

// ---------------------------------------------------------------------------
// [orden-dominio-03] metaNuevaLinea requiere el campo sku
// ---------------------------------------------------------------------------

const validar = validacionCampoModelo(metaNuevaLinea);

describe("[orden-dominio-03] metaNuevaLinea requiere el campo sku", () => {
    test("es válido si sku tiene valor", () => {
        const linea = { ...lineaOrdenVacia(), sku: "PROD-001" };
        expect(validar(linea, "sku")).toBe(true);
    });

    test("es inválido si sku está vacío", () => {
        const linea = { ...lineaOrdenVacia(), sku: "" };
        expect(validar(linea, "sku")).toBe(ERR_SKU_REQUERIDO);
    });

    test("es inválido si sku es null", () => {
        const linea = { ...lineaOrdenVacia(), sku: null as unknown as string };
        expect(validar(linea, "sku")).toBe(ERR_SKU_REQUERIDO);
    });
});

// ---------------------------------------------------------------------------
// [orden-dominio-04] metaNuevaLinea requiere el campo cantidad_prevista
// ---------------------------------------------------------------------------

describe("[orden-dominio-04] metaNuevaLinea requiere el campo cantidad_prevista", () => {
    test("es válido si cantidad_prevista es mayor que cero", () => {
        const linea = { ...lineaOrdenVacia(), cantidadPrevista: 5 };
        expect(validar(linea, "cantidadPrevista")).toBe(true);
    });

    test("es válido si cantidad_prevista es 1", () => {
        const linea = { ...lineaOrdenVacia(), cantidadPrevista: 1 };
        expect(validar(linea, "cantidadPrevista")).toBe(true);
    });

    test("es inválido si cantidad_prevista es null", () => {
        const linea = { ...lineaOrdenVacia(), cantidadPrevista: null as unknown as number };
        expect(validar(linea, "cantidadPrevista")).toBe(ERR_CANTIDAD_PREVISTA_REQUERIDA);
    });
});
