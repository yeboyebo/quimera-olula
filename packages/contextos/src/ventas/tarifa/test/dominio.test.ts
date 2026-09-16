import { NuevoArticuloTarifa } from "#/ventas/tarifa/diseño.ts";
import {
    descripcionArticuloTarifa,
    metaNuevoArticuloTarifa,
    nuevoArticuloTarifaVacio,
} from "#/ventas/tarifa/dominio.ts";
import { tarifaVacia } from "#/ventas/tarifa/detalle/detalle.ts";
import { nuevaTarifaInicial } from "#/ventas/tarifa/crear/crear.ts";
import { ArticuloTarifa } from "#/ventas/tarifa/diseño.ts";
import { validacionCampoModelo } from "@olula/lib/dominio.js";
import { describe, expect, test } from "vitest";

const articuloTarifa = (cambios: Partial<ArticuloTarifa> = {}): ArticuloTarifa => ({
    id: "1",
    articuloId: "ART001",
    descripcionArticulo: "Tornillo",
    tarifaId: "TAR001",
    nombreTarifa: "Mayorista",
    precio: 12.5,
    ...cambios,
});

// ---------------------------------------------------------------------------
// [tarifa-dominio-01] Valores iniciales
// ---------------------------------------------------------------------------

describe("[tarifa-dominio-01] los valores iniciales están vacíos", () => {
    test("tarifaVacia no tiene id, nombre ni divisa", () => {
        expect(tarifaVacia()).toEqual({
            id: "",
            nombre: "",
            divisaId: "",
            divisa: "",
        });
    });

    test("nuevaTarifaInicial no lleva divisa: la pone el servidor", () => {
        expect(nuevaTarifaInicial()).toEqual({ nombre: "", divisaId: "" });
    });

    test("nuevoArticuloTarifaVacio arranca con precio 0", () => {
        expect(nuevoArticuloTarifaVacio()).toEqual({
            articuloId: "",
            descripcionArticulo: "",
            precio: 0,
        });
    });
});

// ---------------------------------------------------------------------------
// [tarifa-dominio-02] Validación del alta de artículo-tarifa
// ---------------------------------------------------------------------------

describe("[tarifa-dominio-02] el alta de artículo-tarifa exige artículo", () => {
    const validar = (modelo: NuevoArticuloTarifa, campo: string) =>
        validacionCampoModelo(metaNuevoArticuloTarifa)(modelo, campo);

    test("sin artículo el campo es inválido", () => {
        expect(validar(nuevoArticuloTarifaVacio(), "articuloId")).toBe(
            "Campo requerido"
        );
    });

    test("con artículo el campo es válido", () => {
        const modelo = { ...nuevoArticuloTarifaVacio(), articuloId: "ART001" };
        expect(validar(modelo, "articuloId")).toBe(true);
    });
});

// ---------------------------------------------------------------------------
// [tarifa-dominio-03] Descripción legible de un artículo-tarifa
// ---------------------------------------------------------------------------

describe("[tarifa-dominio-03] descripcionArticuloTarifa", () => {
    test("combina referencia y descripción cuando hay descripción", () => {
        expect(descripcionArticuloTarifa(articuloTarifa())).toBe(
            "ART001 - Tornillo"
        );
    });

    test("cae a la referencia sola cuando el artículo no tiene descripción", () => {
        expect(
            descripcionArticuloTarifa(articuloTarifa({ descripcionArticulo: "" }))
        ).toBe("ART001");
    });
});
