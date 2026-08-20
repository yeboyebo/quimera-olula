import { LineaAprobarPresupuesto } from "#/ventas/aprobarPresupuesto/diseño.ts";
import {
    lineaCompleta,
    pendienteDeLinea,
    transformarLineasPedido,
} from "#/ventas/aprobarPresupuesto/dominio.ts";
import { describe, expect, test } from "vitest";

const linea = (cambios: Partial<LineaAprobarPresupuesto> = {}): LineaAprobarPresupuesto => ({
    id: "lin-1",
    referencia: "ART1",
    descripcion: "Artículo 1",
    cantidad: 10,
    pvp_unitario: 5,
    pvp_total: 50,
    dto_porcentual: 0,
    dto_lineal: 0,
    iva_incluido: false,
    grupo_iva_producto_id: "GENERAL",
    tipo_irpf: 0,
    tipo_recargo: 0,
    por_comision: 0,
    importe_comision: 0,
    ...cambios,
});

describe("pendienteDeLinea calcula lo que queda por llevar a pedido", () => {
    test("una línea virgen tiene pendiente toda su cantidad", () => {
        expect(pendienteDeLinea(linea({ cantidad: 10 }))).toBe(10);
    });

    test("una línea servida a medias tiene pendiente el resto", () => {
        expect(pendienteDeLinea(linea({ cantidad: 10, servida: 6 }))).toBe(4);
    });

    test("una línea servida al completo no tiene pendiente", () => {
        expect(pendienteDeLinea(linea({ cantidad: 10, servida: 10 }))).toBe(0);
    });

    test("una línea servida de sobra no tiene pendiente negativo", () => {
        expect(pendienteDeLinea(linea({ cantidad: 10, servida: 15 }))).toBe(0);
    });

    test("una línea cerrada no tiene pendiente aunque quede cantidad por servir", () => {
        expect(pendienteDeLinea(linea({ cantidad: 10, servida: 0, cerrada: true }))).toBe(0);
    });
});

describe("lineaCompleta comprueba si la línea queda cubierta del todo", () => {
    test("lo pendiente más lo ya servido cubre la cantidad", () => {
        expect(lineaCompleta(linea({ cantidad: 10, servida: 6, a_pedir: 4 }))).toBe(true);
    });

    test("cubrirla de sobra también cuenta", () => {
        expect(lineaCompleta(linea({ cantidad: 10, servida: 6, a_pedir: 7 }))).toBe(true);
    });

    test("quedarse corto no", () => {
        expect(lineaCompleta(linea({ cantidad: 10, servida: 6, a_pedir: 3 }))).toBe(false);
    });

    test("lo ya servido puede completarla sin pedir nada más", () => {
        expect(lineaCompleta(linea({ cantidad: 10, servida: 10 }))).toBe(true);
    });

    test("una línea sin cantidad nunca está completa", () => {
        expect(lineaCompleta(linea({ cantidad: 0, servida: 5, a_pedir: 5 }))).toBe(false);
    });
});

describe("transformarLineasPedido arma el patch que viaja al servidor", () => {
    test("una línea con a_pedir viaja con su cantidad", () => {
        expect(transformarLineasPedido([linea({ id: "l1", a_pedir: 4 })])).toEqual([
            { id: "l1", cantidad: 4 },
        ]);
    });

    test("las líneas que no piden nada se quedan fuera", () => {
        const lineas = [
            linea({ id: "l1", a_pedir: 4 }),
            linea({ id: "l2", a_pedir: 0 }),
            linea({ id: "l3" }),
        ];
        expect(transformarLineasPedido(lineas).map((l) => l.id)).toEqual(["l1"]);
    });

    test("el payload solo lleva id y cantidad", () => {
        expect(transformarLineasPedido([linea({ id: "l1", a_pedir: 4 })])).toEqual([
            { id: "l1", cantidad: 4 },
        ]);
    });

    test("sin líneas no hay patch", () => {
        expect(transformarLineasPedido([])).toEqual([]);
    });
});
