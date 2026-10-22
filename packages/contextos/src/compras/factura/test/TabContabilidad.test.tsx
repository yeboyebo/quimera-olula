import { Asiento } from "#/contabilidad/asiento/diseño.ts";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

const { getAsiento } = vi.hoisted(() => ({ getAsiento: vi.fn() }));

vi.mock("#/contabilidad/asiento/infraestructura.ts", () => ({ getAsiento }));

const { TabContabilidad } = await import("../detalle/TabContabilidad.tsx");

const asientoDeFactura = (): Asiento => ({
    id: "128",
    numero: 45,
    ejercicioId: "2026",
    fecha: new Date("2026-03-01T12:00:00"),
    concepto: "Factura de compra 2026/17",
    importe: 121,
    manual: false,
    partidas: [
        {
            id: "1",
            asientoId: "128",
            subcuentaId: 11,
            codigoSubcuenta: "6000000",
            debe: 100,
            haber: 0,
            concepto: "Compra",
        },
        {
            id: "2",
            asientoId: "128",
            subcuentaId: 22,
            codigoSubcuenta: "4720000",
            debe: 21,
            haber: 0,
            concepto: "IVA soportado",
        },
        {
            id: "3",
            asientoId: "128",
            subcuentaId: 33,
            codigoSubcuenta: "4000000",
            debe: 0,
            haber: 121,
            concepto: "Proveedor",
        },
    ],
});

describe("TabContabilidad de la factura de compra", () => {
    beforeEach(() => {
        getAsiento.mockReset();
    });

    test("avisa de que no está contabilizada y no llama al API", () => {
        render(<TabContabilidad asientoId={null} />);

        expect(screen.getByText(/todavía no está contabilizada/)).toBeInTheDocument();
        expect(getAsiento).not.toHaveBeenCalled();
    });

    test("carga el asiento de la factura y pinta su cabecera", async () => {
        getAsiento.mockResolvedValue(asientoDeFactura());

        render(<TabContabilidad asientoId="128" />);

        expect(getAsiento).toHaveBeenCalledWith("128");
        await screen.findByText("Factura de compra 2026/17");

        // QInput en solo lectura no pinta un <input>, sino un span con el valor.
        const campo = (nombre: string) =>
            document.querySelector(
                `quimera-input[nombre="${nombre}"] .valor-solo-lectura`
            )?.textContent;

        expect(campo("numero")).toBe("45");
        expect(campo("ejercicio")).toBe("2026");
        expect(campo("concepto")).toBe("Factura de compra 2026/17");
        expect(campo("manual")).toBe("Automático");
    });

    test("pinta las partidas del asiento con sus totales", async () => {
        getAsiento.mockResolvedValue(asientoDeFactura());

        render(<TabContabilidad asientoId="128" />);

        expect(await screen.findByText("6000000")).toBeInTheDocument();
        expect(screen.getByText("4720000")).toBeInTheDocument();
        expect(screen.getByText("4000000")).toBeInTheDocument();
        // Asiento cuadrado: 100 + 21 al debe, 121 al haber, sin descuadre.
        expect(screen.getByText(/Debe: 121\.00 · Haber: 121\.00/)).toBeInTheDocument();
        expect(screen.queryByText(/Descuadre/)).not.toBeInTheDocument();
    });

    test("avisa si el asiento no se puede cargar", async () => {
        getAsiento.mockRejectedValue(new Error("404"));

        render(<TabContabilidad asientoId="128" />);

        expect(await screen.findByText(/No se ha podido cargar el asiento/)).toBeInTheDocument();
    });
});
