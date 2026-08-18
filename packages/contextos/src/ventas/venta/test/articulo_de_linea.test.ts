import { articuloDeLinea } from "#/ventas/venta/dominio.ts";
import { describe, expect, test } from "vitest";

describe("bloque articulo del PATCH de línea", () => {
    test("con referencia manda el id del catálogo", () => {
        expect(articuloDeLinea({ referencia: "ART-001", descripcion: "producto2" })).toEqual({
            articulo_id: "ART-001",
        });
    });

    test("sin referencia manda la descripción", () => {
        expect(articuloDeLinea({ referencia: null, descripcion: "Mano de obra" })).toEqual({
            descripcion: "Mano de obra",
        });
    });

    test("una referencia vacía cuenta como línea sin artículo", () => {
        expect(articuloDeLinea({ referencia: "", descripcion: "Portes" })).toEqual({
            descripcion: "Portes",
        });
    });

    test("los dos campos son excluyentes", () => {
        expect(articuloDeLinea({ referencia: "ART-001", descripcion: "x" })).not.toHaveProperty("descripcion");
        expect(articuloDeLinea({ referencia: null, descripcion: "x" })).not.toHaveProperty("articulo_id");
    });
});
