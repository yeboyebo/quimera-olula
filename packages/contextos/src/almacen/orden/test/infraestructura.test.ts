import { describe, test, expect } from "vitest";
import {
    lineaOrdenDesdeApi,
    lineaOrdenAApi,
} from "#/almacen/orden/infraestructura.ts";
import type { LineaOrdenAlmacenApi } from "#/almacen/orden/infraestructura.ts";
import type { LineaOrdenAlmacen } from "#/almacen/orden/diseño.ts";

// ---------------------------------------------------------------------------
// [orden-infra-01] lineaOrdenDesdeApi convierte de snake_case API a camelCase dominio
// ---------------------------------------------------------------------------

describe("[orden-infra-01] lineaOrdenDesdeApi convierte correctamente de snake_case API a camelCase dominio", () => {
    const lineaApi: LineaOrdenAlmacenApi = {
        id: "linea-1",
        sku: "PROD-001",
        articulo: "Producto 001",
        lote_id: "LOTE-123",
        cantidad_prevista: 10,
        ubicacion_origen_id: "UBI-001",
        caja_origen_id: null,
        ubicacion_destino_id: "UBI-002",
        caja_destino_id: null,
        lecturas: [],
    };

    test("mapea sku correctamente", () => {
        const linea = lineaOrdenDesdeApi(lineaApi);
        expect(linea.sku).toBe("PROD-001");
    });

    test("mapea lote_id a loteId", () => {
        const linea = lineaOrdenDesdeApi(lineaApi);
        expect(linea.loteId).toBe("LOTE-123");
    });

    test("mapea cantidad_prevista a cantidadPrevista", () => {
        const linea = lineaOrdenDesdeApi(lineaApi);
        expect(linea.cantidadPrevista).toBe(10);
    });

    test("mapea ubicacion_origen_id a ubicacionOrigenId", () => {
        const linea = lineaOrdenDesdeApi(lineaApi);
        expect(linea.ubicacionOrigenId).toBe("UBI-001");
    });

    test("mapea caja_origen_id a cajaOrigenId (null)", () => {
        const linea = lineaOrdenDesdeApi(lineaApi);
        expect(linea.cajaOrigenId).toBeNull();
    });

    test("mapea ubicacion_destino_id a ubicacionDestinoId", () => {
        const linea = lineaOrdenDesdeApi(lineaApi);
        expect(linea.ubicacionDestinoId).toBe("UBI-002");
    });

    test("mapea caja_destino_id a cajaDestinoId (null)", () => {
        const linea = lineaOrdenDesdeApi(lineaApi);
        expect(linea.cajaDestinoId).toBeNull();
    });

    test("mapea lote_id null correctamente", () => {
        const lineaSinLote: LineaOrdenAlmacenApi = { ...lineaApi, lote_id: null };
        const linea = lineaOrdenDesdeApi(lineaSinLote);
        expect(linea.loteId).toBeNull();
    });
});

// ---------------------------------------------------------------------------
// [orden-infra-02] lineaOrdenAApi convierte de camelCase dominio a snake_case API
// ---------------------------------------------------------------------------

describe("[orden-infra-02] lineaOrdenAApi convierte correctamente de camelCase dominio a snake_case API", () => {
    const lineaDominio: LineaOrdenAlmacen = {
        id: "linea-1",
        sku: "PROD-001",
        articulo: "Producto 001",
        loteId: "LOTE-123",
        cantidadPrevista: 10,
        ubicacionOrigenId: "UBI-001",
        cajaOrigenId: null,
        ubicacionDestinoId: "UBI-002",
        cajaDestinoId: null,
        lecturas: [],
    };

    test("mapea sku correctamente", () => {
        const lineaApi = lineaOrdenAApi(lineaDominio);
        expect(lineaApi.sku).toBe("PROD-001");
    });

    test("mapea loteId a lote_id", () => {
        const lineaApi = lineaOrdenAApi(lineaDominio);
        expect(lineaApi.lote_id).toBe("LOTE-123");
    });

    test("mapea cantidadPrevista a cantidad_prevista", () => {
        const lineaApi = lineaOrdenAApi(lineaDominio);
        expect(lineaApi.cantidad_prevista).toBe(10);
    });

    test("mapea ubicacionOrigenId a ubicacion_origen_id", () => {
        const lineaApi = lineaOrdenAApi(lineaDominio);
        expect(lineaApi.ubicacion_origen_id).toBe("UBI-001");
    });

    test("mapea cajaOrigenId a caja_origen_id (null)", () => {
        const lineaApi = lineaOrdenAApi(lineaDominio);
        expect(lineaApi.caja_origen_id).toBeNull();
    });

    test("mapea ubicacionDestinoId a ubicacion_destino_id", () => {
        const lineaApi = lineaOrdenAApi(lineaDominio);
        expect(lineaApi.ubicacion_destino_id).toBe("UBI-002");
    });

    test("mapea cajaDestinoId a caja_destino_id (null)", () => {
        const lineaApi = lineaOrdenAApi(lineaDominio);
        expect(lineaApi.caja_destino_id).toBeNull();
    });

    test("mapea loteId null a lote_id null", () => {
        const lineaSinLote: LineaOrdenAlmacen = { ...lineaDominio, loteId: null };
        const lineaApi = lineaOrdenAApi(lineaSinLote);
        expect(lineaApi.lote_id).toBeNull();
    });
});
