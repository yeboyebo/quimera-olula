import { describe, expect, test } from "vitest";
import { criteriaInformeMayor, criteriaInformePeriodo, nombreFicheroPdfInforme } from "../dominio.ts";

describe("criteria informes contables", () => {
    test("criteriaInformePeriodo incluye ejercicio y fechas opcionales", () => {
        const c = criteriaInformePeriodo({
            ejercicioId: "2026",
            fechaDesde: "2026-01-01",
            fechaHasta: "2026-03-31",
        });

        expect(c.filtro).toEqual([
            ["ejercicio_id", "eq", "2026"],
            ["fecha", ">=", "2026-01-01"],
            ["fecha", "<=", "2026-03-31"],
        ]);
    });

    test("criteriaInformePeriodo omite las fechas en blanco", () => {
        const c = criteriaInformePeriodo({ ejercicioId: "2026", fechaDesde: "  " });

        expect(c.filtro).toEqual([["ejercicio_id", "eq", "2026"]]);
    });

    test("criteriaInformeMayor añade subcuenta_id", () => {
        const c = criteriaInformeMayor({
            ejercicioId: "2026",
            subcuentaId: "12345",
        });

        expect(c.filtro).toContainEqual(["subcuenta_id", "eq", "12345"]);
        expect(c.filtro).toContainEqual(["ejercicio_id", "eq", "2026"]);
    });

    test("nombreFicheroPdfInforme alinea nombres inline del backend", () => {
        expect(nombreFicheroPdfInforme("mayor")).toBe("mayor.pdf");
        expect(nombreFicheroPdfInforme("diario")).toBe("diario.pdf");
    });
});
