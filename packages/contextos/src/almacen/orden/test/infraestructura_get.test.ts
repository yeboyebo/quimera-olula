import { describe, test, expect } from "vitest";
import { itemOrdenDesdeApi, ItemOrdenApi } from "#/almacen/orden/infraestructura.ts";
import type { ItemOrdenAlmacen } from "#/almacen/orden/diseño.ts";

// ---------------------------------------------------------------------------
// [orden-infra-03] itemOrdenDesdeApi convierte un ItemOrdenApi (snake_case) al tipo dominio ItemOrdenAlmacen (camelCase)
// ---------------------------------------------------------------------------

describe("[orden-infra-03] itemOrdenDesdeApi convierte un ItemOrdenApi (snake_case) al tipo dominio ItemOrdenAlmacen (camelCase)", () => {
    const itemApi: ItemOrdenApi = {
        id: "ORD-001",
        fecha: "2026-06-21",
        tipo: "ENTRADA",
        abierta: true,
        estado: "PENDIENTE",
        ubicacion_origen_id: "UBI-001",
        caja_origen_id: "CAJA-001",
        ubicacion_destino_id: "UBI-002",
        caja_destino_id: "CAJA-002",
    };

    test("mapea id correctamente", () => {
        const item: ItemOrdenAlmacen = itemOrdenDesdeApi(itemApi);
        expect(item.id).toBe("ORD-001");
    });

    test("mapea fecha correctamente", () => {
        const item: ItemOrdenAlmacen = itemOrdenDesdeApi(itemApi);
        expect(item.fecha).toBe("2026-06-21");
    });

    test("mapea tipo correctamente", () => {
        const item: ItemOrdenAlmacen = itemOrdenDesdeApi(itemApi);
        expect(item.tipo).toBe("ENTRADA");
    });

    test("mapea abierta correctamente", () => {
        const item: ItemOrdenAlmacen = itemOrdenDesdeApi(itemApi);
        expect(item.abierta).toBe(true);
    });

    test("mapea estado correctamente", () => {
        const item: ItemOrdenAlmacen = itemOrdenDesdeApi(itemApi);
        expect(item.estado).toBe("PENDIENTE");
    });

    test("mapea ubicacion_origen_id a ubicacionOrigenId", () => {
        const item: ItemOrdenAlmacen = itemOrdenDesdeApi(itemApi);
        expect(item.ubicacionOrigenId).toBe("UBI-001");
    });

    test("mapea caja_origen_id a cajaOrigenId", () => {
        const item: ItemOrdenAlmacen = itemOrdenDesdeApi(itemApi);
        expect(item.cajaOrigenId).toBe("CAJA-001");
    });

    test("mapea ubicacion_destino_id a ubicacionDestinoId", () => {
        const item: ItemOrdenAlmacen = itemOrdenDesdeApi(itemApi);
        expect(item.ubicacionDestinoId).toBe("UBI-002");
    });

    test("mapea caja_destino_id a cajaDestinoId", () => {
        const item: ItemOrdenAlmacen = itemOrdenDesdeApi(itemApi);
        expect(item.cajaDestinoId).toBe("CAJA-002");
    });

    test("mapea ubicacion_origen_id null a ubicacionOrigenId null", () => {
        const itemSinUbicacionOrigen: ItemOrdenApi = { ...itemApi, ubicacion_origen_id: null };
        const item: ItemOrdenAlmacen = itemOrdenDesdeApi(itemSinUbicacionOrigen);
        expect(item.ubicacionOrigenId).toBeNull();
    });

    test("mapea caja_origen_id null a cajaOrigenId null", () => {
        const itemSinCajaOrigen: ItemOrdenApi = { ...itemApi, caja_origen_id: null };
        const item: ItemOrdenAlmacen = itemOrdenDesdeApi(itemSinCajaOrigen);
        expect(item.cajaOrigenId).toBeNull();
    });
});
